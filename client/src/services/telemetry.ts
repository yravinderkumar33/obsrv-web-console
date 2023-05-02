//import * as Telemetry from '@project-sunbird/telemetry-sdk';
import { IImpressionData, IInteractData, ILogData } from 'types/telemetry';

const getOptions = (data?: Object) => {
  return {
    eid: '',
    ets: 0,
    ver: '1.0.0',
    context: {
      env: 'dev',
      did: 'deviceId',
      channel: 'obsrv',
      pdata: {
        id: 'dev.obsrv.console',
        pid: 'obsrv-console',
        ver: '1.0.0'
      }
    },
    actor: {
      id: 'userId',
      type: 'client'
    },
    object: {},
    edata: {}
  };
};

class TelemetryService {
  private static instance: TelemetryService;

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }

    return TelemetryService.instance;
  }

  public start(data: any) {
    console.log('Telemetry.Start', JSON.stringify(data));
    // if (Telemetry.initialized) {
    //   const options = getOptions(data);
    //   //Telemetry.start(data, options);
    // }
  }

  public end(data: any) {
    console.log('Telemetry.end', JSON.stringify(data));
    // if (Telemetry.initialized) {
    //   const options = getOptions(data);
    //   //Telemetry.end(data, options);
    // }
  }

  public interact(interactData: IInteractData, object: Object) {
    const options = getOptions();
    const currentTime = Date.now();

    options.eid = 'INTERACT';
    options.ets = currentTime;
    options.object = object;
    options.edata = interactData;
    const finalData = options;

    console.log('Telemetry.interact', JSON.stringify(finalData));

    // if (Telemetry.initialized) {
    //   const options = getOptions();
    //   // const interactData= {
    //   //   id: data.id,
    //   //   type: data.type,
    //   //   ver: data.ver,
    //   // };

    //   console.log('Telemetry generated event', Telemetry.interact(interactData, options));
    // }
  }

  public impression(impressionData: IImpressionData, object: Object) {
    const options = getOptions();
    const currentTime = Date.now();
    options.eid = 'IMPRESSION';
    options.ets = currentTime;
    options.object = object;
    options.edata = impressionData;
   
    const finalData = options;
    console.log('Telemetry.impression', JSON.stringify(finalData));
    // if (Telemetry.initialized) {
    //   const options = getOptions(data);
    //   const impressionData = {
    //     id: data.id,
    //     type: data.type,
    //     pageId: data.pageId,
    //     uri: data.uri
    //   };
    //   //Telemetry.impression(impressionData, options);
    // }
  }
}
export const telemetry = TelemetryService.getInstance();
