export const interactIds = {
  alert: {
    contactSupport: 'alert:contactSupport',
    resolve: 'alert:resolve',
    dialog: {
      cancel: 'alert:dialog:cancel',
      agree: 'alert:dialog:agree'
    }
  },
  button: {
    icon: {
      tooltip: 'button:icon:tooltip',
      menu: {
        open: 'button:icon:menu:open',
        close: 'button:icon:menu:close'
      } 
  
    },
    scroll: 'button:scroll',
    snackbar: {
      undo: 'button:snackbar:undo',
      close: 'button:snackbar:close'
    },
    download: 'button:download:events',
    input: {
      password: {
        visible: 'button:input:password:visible',
        invisible: 'button:input:password:invisible'
      }
    }
  },
  card: {
    info: 'card:info'
  },
  chart: {
    filter: 'chart:filter'
  },
  dataset: {
    view:'dataset:view',
    create: {
      add: {
        transformation: 'dataset:create:add:transformation',
        denorm: 'dataset:create:add:denorm'
      },
      delete: {
        transformation: 'dataset:create:delete:transformation',
        denorm: 'dataset:create:delete:denorm'
      },
      publish: 'dataset:create:publish'
    },
    edit: {
      add: {
        transformation: 'dataset:edit:add:transformation',
        denorm: 'dataset:edit:add:denorm'
      },
      delete: {
        transformation: 'dataset:edit:delete:transformation',
        denorm: 'dataset:edit:delete:denorm'
      },
      publish: 'dataset:edit:publish'
    }
  },
  description: {
    edit: 'description:edit'
  },
  events: {
    create: 'events:create'
  },
  file: {
    remove: {
      one: 'file:remove:one',
      many: 'file:remove:many'
    }
  },
  kafka: {
    verify: 'kafka:verify'
  },
  masterDataset: {
    create: {
      add: {
        transformation: 'masterDataset:create:add:transformation',
        denorm: 'masterDataset:create:add:denorm'
      },
      delete: {
        transformation: 'masterDataset:create:delete:transformation',
        denorm: 'masterDataset:create:delete:denorm'
      },
      publish: 'masterDataset:create:publish'
    },
    edit: {
      add: {
        transformation: 'masterDataset:edit:add:transformation',
        denorm: 'masterDataset:edit:add:denorm'
      },
      delete: {
        transformation: 'masterDataset:edit:delete:transformation',
        denorm: 'masterDataset:edit:delete:denorm'
      },
      publish: 'masterDataset:edit:publish'
    }
  },
  object: {
    id: '1.0.0'
  },
  pii: {
    add: 'pii:add:field'
  },
  rollup: {
    add: 'rollup:add:config',
    delete: 'rollup:delete:config'
  },
  schema: {
    upload: 'json:schema:upload',
    edit: 'json:schema:edit'
  },
  suggestions: {
    optional: 'suggestions:optional',
    required: 'suggestions:required'
  }
};
