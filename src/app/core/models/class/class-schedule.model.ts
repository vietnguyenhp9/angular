export class ClassSchedule {
  beginningDateTime: string;
  schedule: {
    isRepeatOnSunday: boolean;
    isRepeatOnMonday: boolean;
    isRepeatOnTuesday: boolean;
    isRepeatOnWednesday: boolean;
    isRepeatOnThursday: boolean;
    isRepeatOnFriday: boolean;
    isRepeatOnSaturday: boolean;
  };
  clubId: number;
  classId: string;
  durationInMins: number;
  maxiumNumberOfMember: number;
  maxiumReserveMember: number;
  ptId: number;
  studioId: string;
  isRepeat: boolean;
}