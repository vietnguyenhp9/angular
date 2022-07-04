import * as moment from 'moment';
import { environment } from 'src/environments/environment.local';
import { SystemConstant } from '../constants/system.constant';

/**
 * Map channel name with config webhook env
 */
const ACCEPT_ENV = ['production', 'staging'];
/**
 * @params {preContent: optional, message: required} description
 * @params {string} webHookUrl - Slack web hook url
 * @params {boolean} isBlockEl - Set it true if message is block element
 */
async function handleMessage(
  description: { preContent?: any; message: any; },
  webHookUrl = '',
  isBlockEl = false,
): Promise<any> {
  const serviceName = 'crm-gym-web-v2';
  const env = environment.ENV;
  const time = moment().format(SystemConstant.TIME_FORMAT.DEFAULT);
  if (!description) {
    throw new Error('Description is invalid.');
  }
  let content = '', preContent = '';

  if (description.preContent) {
    const data = description.preContent;
    if (typeof data === 'string') {
      // remove space (Regex: match at least 2 space/line-break or more)
      preContent = data.replace(/(?:\s{2,})/g, '\n');
    } else if (typeof data === 'object') {
      Object.getOwnPropertyNames(data).map((el) => {
        preContent += `*${el}*: \`${data[el]}\`\n`;
      });
    }
  }

  if (description.message) {
    const data = description.message;
    if (typeof data === 'string') {
      content = data.replace(/(?:\s{2,})/g, '\n');
    } else if (typeof data === 'object') {
      content = JSON.stringify(data, Object.getOwnPropertyNames(data));
    }
  }
  const title = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Service: ${serviceName}*\n*Env: ${env}*\n*Time: ${time}*\n`,
    },
  };
  const divider = {
    type: 'divider',
  };
  const preContentBlock = preContent && {
    type: 'section',
    text: { type: 'mrkdwn', text: `${preContent || ''}` },
  };
  const contentBlock = isBlockEl
    ? description.message
    : content && [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `\`\`\`${content}\`\`\`` },
      },
    ];
  const attachmentData = [
    { blocks: [preContentBlock] },
    { blocks: contentBlock || [] },
  ].filter((e) => e.blocks[0]);

  const message = {
    text: `${serviceName}\tENV: ${env}`,
    blocks: [title, divider],
    attachments: attachmentData,
  };
  return this.http.post(webHookUrl, message).subscribe();
}

/**
 * @params {string or object} preContent: optional, message: required
 * @params {string} envChannel - Slack notifi channel name
 * @params {boolean} isBlockEl - Set it true if message is block element
 */
async function send(preContent, message = [], envChannel, isBlockEl = false) {
  const env = environment.ENV;
  if (!ACCEPT_ENV.includes(env + '')) {
    console.log('Not send slack on env local');
    return;
  }
  const hookUrl = environment[envChannel] || '';
  if (hookUrl) {
    const webHookUrl = 'https://hooks.slack.com/services/' + hookUrl;
    const description = { preContent: preContent, message: message };
    await handleMessage(description, webHookUrl, isBlockEl);
  } else {
    console.log(`Error: Invalid slack envChannel "${envChannel}"`);
    return;
  }
}

export { send };
