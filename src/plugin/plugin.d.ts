import { ApplicationOption } from '../types';

declare global {
  interface JQuery {
    myMVPSlider(options: ApplicationOption): JQuery;
  }
}
