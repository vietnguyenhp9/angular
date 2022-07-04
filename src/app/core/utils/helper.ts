import { FormGroup } from '@angular/forms';
import { get } from 'lodash';
import * as moment from 'moment';
import { ImageDetailComponent } from 'src/app/shared/image-detail/image-detail.component';
import * as XLSX from 'xlsx';
import { LanguageConstant } from '../constants/language.constant';
import { SystemConstant } from '../constants/system.constant';
import { UrlConstant } from '../constants/url.constant';

//------------------- Function Helper --------------------

// Xu Li Paging
const getPage = (total: number, pageSize: number) => {
  return total > pageSize ? Math.ceil(total / pageSize) : 1;
};

// Format Number Money
const numberFormatMoney = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//  Export File Excel
const exportExcel = (data: any, name: string) => {
  const _data = data.map((item: any) => {
    for (const [key, value] of Object.entries(item)) {
      const newKey = capitalizeFirstLetter(key)
        .split(/(?=[A-Z])/)
        .join(' ');
      if (isIsoDate(value)) {
        item[key] = moment(value).format(SystemConstant.TIME_FORMAT.EXPORT_EXCEL);
      }
      item[newKey] = item[key];
      delete item[key];
    }
    return item;
  });
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(_data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, name);
};

// Check String Is Date Type ISO
const isIsoDate = (str) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var date = new Date(str);
  return date.toISOString() === str;
};

// Get Data For SelectBox Filter
const getDataSelect = async (functionName) => {
  return functionName.toPromise().then((res: any) => {
    return res.data.hasOwnProperty('result')
      ? res.data.result
      : res.data;
  });
};

// Get Month Year
const getListMonthYear = () => {
  const currenYear = moment().get('year');
  const timeMonthYear = {
    year: Array.from({ length: 5 }, (_, i) => currenYear - i).reverse(),
    month: Array.from({ length: 12 }, (_, i) => i + 1)
  };
  return timeMonthYear;
};

// Get Trans Language By Key
const transLang = (key: string) => {
  const currentLang = localStorage.getItem(SystemConstant.LANGUAGE) || 'en';
  return get(LanguageConstant[currentLang], key);
};

// Format Date (Use for edit contract, transactions) 
const formatDate = (dateValue: any, timeValue?: any) => {
  return moment(dateValue.value).format(SystemConstant.TIME_FORMAT.YY_MM_DD) + ' ' + timeValue.value;
};

// Reset Field Form
const resetFieldForm = (form: FormGroup, fieldArray: string[]) => {
  fieldArray.forEach(element => {
    form.get(element).setValue(null);
  });
};

// HyperLink Membmer
const hyperLinkMember = (accountId: string) => {
  const url = UrlConstant.ROUTE.MAIN.CLUB_MEMBERS + `/${accountId}`;
  return window.open(url, '_blank');
};

// Rotate Images 
const rotateImages = (image: any, modalSvc: any, userIdentityCardDefault: string, type: string) => {
  const modalRef = modalSvc.open(ImageDetailComponent,
    {
      windowClass: "image-detail-wrap",
      modalDialogClass: "image-detail",
      size: 'md',
      centered: true,
      backdrop: true
    });
  const typeImage =
  {
    ava: "hidden-button-ava",
    idCard: (image === userIdentityCardDefault) ? "hidden-button-idcard" : ""
  };
  modalRef.componentInstance.image = image;
  modalRef.componentInstance.disable = typeImage[type];
};

// Fix Event More Scroll When Click More (FullCalendar)
const hasClass = (elem, className) => elem.className.split(" ").indexOf(className) > -1;
const resizePopupBody = () => {
  const popupBody = Array.from(document.getElementsByClassName("fc-popover-body") as HTMLCollectionOf<HTMLElement>)[0];
  const pos = popupBody.getBoundingClientRect();
  const window_height = window.innerHeight;
  if (pos.bottom > window_height) {
    const newMaxHeight = pos.height - (pos.bottom - window_height);
    popupBody.style.maxHeight = newMaxHeight + "px";
  }
};

const getTimeFormat = (time) => {
  return moment(time).isValid() ? moment(time).format(
    SystemConstant.TIME_FORMAT.DEFAULT
  ) : null
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
  getPage,
  numberFormatMoney,
  exportExcel,
  getDataSelect,
  getListMonthYear,
  transLang,
  formatDate,
  resetFieldForm,
  isIsoDate,
  hyperLinkMember,
  rotateImages,
  hasClass,
  resizePopupBody,
  getTimeFormat
};
