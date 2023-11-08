import { EEmailAction } from "../enums/email.action.enum";

export const templates = {
  [EEmailAction.REGISTER]: {
    templateName: "register",
    subject: "Hello, welcome to our App!",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Do not worry, your password will be restored",
  },
  [EEmailAction.OLD_VISIT]: {
    templateName: "old-visit",
    subject: "Hello!!!",
  },
};
