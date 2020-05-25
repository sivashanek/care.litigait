import { format } from 'date-fns';
import PatientStatus from '../../enums/PatientStatus';

export const optionalDateFormat = date => date ? format(date, 'hh:mm A') : date;

export const getCurrentStatus = (events) => {
  if (events.ableToVisitAt) {
    return PatientStatus.ABLE_TO_VISIT
  } else if (events.recoveryAt) {
    return PatientStatus.PACU;
  } else if (events.orAt) {
    return PatientStatus.IN_OR;
  } else if (events.preOpAt) {
    return PatientStatus.PRE_OP;
  }
  return PatientStatus.ADMITTED;
};

/**
 * @param {{}} events
 * @return {{ADMITTED: boolean, PRE_OP: boolean, IN_OR: boolean, PACU: boolean, ABLE_TO_VISIT: boolean}}
 */
export const getStatusObject = (events = {}) => {
  return {
    ADMITTED: Boolean(events && events.admittedAt),
    PRE_OP: Boolean(events && events.preOpAt),
    IN_OR: Boolean(events && events.orAt),
    PACU: Boolean(events && events.recoveryAt),
    ABLE_TO_VISIT: Boolean(events && events.ableToVisitAt),
  };
};

/**
 * @param events
 * @return {{ADMITTED: string, PRE_OP: string, IN_OR: string, PACU: string, ABLE_TO_VISIT: string}}
 */
export const getStatusTimestamps = (events = {}) => {
  return {
    ADMITTED: events && events.admittedAt ? optionalDateFormat(events.admittedAt) : '',
    PRE_OP: events && events.preOpAt ? optionalDateFormat(events.preOpAt ) : '',
    IN_OR: events && events.orAt ? optionalDateFormat(events.orAt ) : '',
    PACU: events && events.recoveryAt ? optionalDateFormat(events.recoveryAt ) : '',
    ABLE_TO_VISIT: events && events.ableToVisitAt ? optionalDateFormat(events.ableToVisitAt ) : '',
  };
};
