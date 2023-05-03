import * as _ from 'lodash';
import { v4 } from 'uuid'

const getOptions = () => {
  return {
    eid: '',
    ets: Date.now(),
    ver: '1.0.0',
    mid: v4(),
    actor: {
      id: '13234',
      type: 'User'
    },
    context: {
      env: _.get(process, 'env.REACT_APP_ENV') || "local",
      sid: '42342',
      pdata: {
        id: 'dev.obsrv.console',
        ver: '1.0.0'
      }
    },
    object: {},
    edata: {}
  };
};

const logEvent = (event: Record<string, any>) => {
  console.log(event);
}

const generateInteractEvent = ({ object, edata, eid }: any) => {
  const defaultPayload = getOptions();
  const event = { ...defaultPayload, eid, object, edata };
  logEvent(event);
}

export const globalInteractEventsHandler = (event: any) => {
  const target = _.get(event, 'target');
  const dataset = _.get(target, 'dataset');
  if (!(target && dataset)) return;
  const { edataid, edatatype = 'CLICK', objectid, objecttype, objectversion = '1.0.0' } = dataset as Record<string, any>;
  const edata = { id: edataid || target.id, type: edatatype };
  const object = { ...(objectid && objecttype && { objectid, objecttype, objectversion }) };
  generateInteractEvent({ edata, object, eid: "INTERACT" })
}

const generateImpressionEvent = ({ object, edata }: any) => {
  const defaultPayload = getOptions();
  const event = { ...defaultPayload, eid: "IMPRESSION", object, edata };
  logEvent(event);
}

const generateStartEvent = () => {

}

const generateEndEvent = () => {

}