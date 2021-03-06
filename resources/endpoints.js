/**
* MIT License
*
* Copyright (c) 2018-present, Walmart Inc.,
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/
var midway = require('../index');
midway.id('example');
var Path = require('path');

midway.addGlobalVariant({
  id: 'globalVariant',
  label: 'Global variant',
  handler: function (req, reply) {
    reply({global: 'this is a global variant'});
  }
});

midway.route({
  id: 'setState',
  label: 'Add State',
  path: '/addState',
  handler: function (req, reply) {
    var stateValue = req.query.stateValue;
    midway.addState(this, 'test', stateValue);
    reply(stateValue);
  }
});

midway.route({
  id: 'getState',
  label: 'GET State',
  path: '/getState',
  handler: function (req, reply) {
    var state = midway.getState(this, 'test');
    reply(state);
  }
});

midway.route({
  id: 'clearState',
  label: 'Clear State',
  path: '/clearState',
  handler: function (req, reply) {
    if (req.query.midwaySessionId) {
      midway.clearState(req.query.midwaySessionId);
    } else {
      midway.clearState();
    }
    var state = midway.getState(this, 'test');
    reply(state);
  }
});


midway.route({
  id: 'closeSessions',
  label: 'Close Sessions Test',
  path: '/closeSessionTest',
  handler: function (req, reply) {
    reply('default');
  }
})

  .variant({
    id: 'variant',
    label: 'not_default',
    handler: function (req, reply) {
      reply('not_default');
    }
  });


var corsHeaders = {
  origin: ['*'],
  headers: ['Access-Control-Allow-Headers', 'Access-Control-Request-Method', 'Access-Control-Allow-Origin', 'Origin, X-Requested-With, Content-Type, Accept'],
  credentials: true
};

//Basic route
midway.route({
  id: 'helloFromMidway',
  label: 'Hello message from Midway',
  path: '/helloMidway',
  config: {
    cors: corsHeaders
  },

  variantLabel: 'hello from midway',
  handler: function (req, reply) {
    reply('Hello from Midway');
  }
});

// Respond with Variants instead of main route.
midway.route({
  id: 'respondWithVariant',
  label: 'Respond With Variant',
  path: '/respondWithVariant/{id?}',
  variantLabel: 'Respond With Variant Main Route',
  handler: function (req, reply) {
    if (!req.params.id) {
      midway.util.respondWithMockVariant(this, 'variant', req, reply); // make sure that the variant exist in the same route.
    } else {
      midway.util.respondWithMockVariant(this, 'variant1', req, reply); // make sure that the variant exist in the same route.
    }
  }
})
  .variant({
    id: 'variant',
    label: 'Respond With Variant Variant Route',
    handler: function (req, reply) {
      reply('I am an example of respond_with_mock_variant instead of response of main route');
    }
  })

  .variant({
    id: 'variant1',
    label: 'Respond With Variant Variant Route',
    handler: function (req, reply) {
      reply('I am an example of respond_with_mock_variant instead of response of main route - 1');
    }
  });

midway.route({
  id: 'respondWithVariant-error',
  label: 'Respond With Variant',
  path: '/respondWithVariantError',
  variantLabel: 'Respond With Variant Main Route',
  handler: function (req, reply) {
    midway.util.respondWithMockVariant(this, 'variant', req, reply); // make sure that the variant exist in the same route.
  }
})

  .variant({
    id: 'variant1',
    label: 'Respond With Variant Variant Route',
    handler: function (req, reply) {
      reply('I am an example of respond_with_mock_variant instead of response of main route - 1');
    }
  });

midway.route({
  id: 'respondWithVariant-path-diff',
  label: 'Respond With Variant',
  path: '/respondWithVariantPathDiffFromId',
  variantLabel: 'Respond With Variant Main Route',
  handler: function (req, reply) {
    midway.util.respondWithMockVariant(this, 'variant', req, reply); // make sure that the variant exist in the same route.
  }
})
  .variant({
    id: 'variant',
    label: 'Respond With Variant Variant Route',
    handler: function (req, reply) {
      reply('respondWithVariantPathDiffFromId');
    }
  });


midway.route({
  id: 'respondWithVariant-reply-from-file',
  label: 'Respond With Variant from file',
  path: '/respondWithVariantReplyFromFile',
  variantLabel: 'Respond With Variant From File',
  handler: function (req, reply) {
    midway.util.respondWithMockVariant(this, 'variant1', req, reply); // make sure that the variant exist in the same route.
  }
})
  .variant({
    id: 'variant1',
    label: 'Respond With Mock Variant From file - variant1',
    handler: function (req, reply) {
      midway.util.respondWithFile(this, reply);
    }
  });


// Routes with variants
midway.route({
  id: 'message',
  label: 'Hello Variants',
  path: '/message',

  variantLabel: 'hello world',
  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply, {code: 202});
  }
})
    .variant({
      id: 'variant',
      label: 'variant',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply, {filePath: './message/GET/variant.json', code: 302});
      }
    })

    .variant({
      id: 'universe',
      label: 'hello universe',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply, {filePath: './message/GET/universe.json', code: 202});
      }
    })

    .variant({
      id: 'variant with delay',
      label: 'variant with delay',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply, {filePath: './message/GET/variant_with_delay.json', delay: 1000});
      }
    })

    .variant({
      id: 'variant with absolute path',
      label: 'variant with absolute path',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply, {filePath: Path.join(process.cwd(), 'resources/mocked-data/message/GET/variant.json')});
      }
    })

    .variant({
      id: 'variant with setpayload as json',
      label: 'variant with setpayload as json',
      headers: ['Content-Type: json'],
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply, {filePath: './message/GET/variant_with_setPayload_as_json.json'});
      }
    })
    .variant({
      id: 'variant with setpayload as file',
      label: 'variant with setpayload as file',
      headers: ['Content-Type: json'],
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply, {filePath: './message/GET/variant_with_setPayload_as_file.json'});
      }
    })

    .variant({
      id: 'transpose',
      label: 'Transpose To World',
      handler: function (req, reply) {
        var dataToChange = {
          'collection.sectionOne.type': 'Hello',
          'collection.sectionOne.newData': 'Universe'
        };
        midway.util.respondWithFile(this, reply, {transpose: dataToChange, code: 300});
      }
    })

    .variant({
      id: 'fileDoesNotExists',
      label: 'File Does Not Exists',
      handler: function (req, reply) {
        var dataToChange = {
          'collection.sectionOne.type': 'World'
        };
        midway.util.respondWithFile(this, reply, {transpose: dataToChange, code: 202});
      }
    })

    .variant({
      id: 'fileDoesNotExists2',
      label: 'File Does Not Exists',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply);
      }
    });


//routes with query params
midway.route({
  id: 'getCollection',
  label: 'Get Collection',
  path: '/product/grouping/api/collection/{collectionId}',
  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply);
  }
})

    .variant({
      id: 'discount',
      label: 'Get Discount Collection',
      handler: function (req, reply) {
        reply({message: 'hello pre-order'});
      }
    }).respondWithFile();

// routes with input params
midway.route({
  id: 'wish',
  label: 'Wish Happy Birthday',
  path: '/wish',
  method: 'GET',

  input: {
    person: {
      label: 'Name',
      type: 'text',
      defaultValue: 'Daniel'
    },
    hobby: {
      label: 'Do you like sports',
      type: 'boolean',
      defaultValue: 'true'
    }
  },

  handler: function (req, reply) {
    // routes can have a default handler but do not have to
    if (this.input('hobby')) {
      reply({message: 'Happy Birthday ' + this.input('person') + '. I got you tickets to a Football game.'});
    } else {
      reply({message: 'Happy Birthday ' + this.input('person') + '. I got you Macy\'s gift card.'});
    }
  }
});

//routes for setMockId
midway.route({
  id: 'test-setMockId',
  label: 'Set Mock Id',
  path: '/api/setMockId',

  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply);
  }
});

midway.route({
  id: 'test-setMockId-1',
  label: 'Set Mock Id 1',
  path: '/api/setMockId1',
  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply);
  }
});

midway.route({
  id: 'test-setMockId-code',
  label: 'Set Mock Id Code',
  path: '/api/setMockIdCode',
  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply);
  }
});

midway.route({
  id: 'file-extension',
  label: 'File Extension',
  path: '/extension',
  variantLabel: 'JSON FILE',
  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply);
  }
})
    .variant({
      id: 'HTML',
      label: 'HTML file type - UTIL',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply);
      }
    })

    .variant({
      id: 'TXT',
      label: 'Txt file type - util',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply);
      }
    })

    .variant({
      id: 'Unknown',
      label: 'Unknown file type - util',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply);
      }
    })

    .variant({
      id: 'json-respondWithFile',
      label: 'JSON file type - UTIL'
    }).respondWithFile()

    .variant({
      id: 'HTML-respondWithFile',
      label: 'HTML file type - UTIL'
    }).respondWithFile()

    .variant({
      id: 'TXT-respondWithFile',
      label: 'Txt file type - util'
    }).respondWithFile()

    .variant({
      id: 'Unknown-respondWithFile',
      label: 'Unknown file type - util'
    }).respondWithFile()

    .variant({
      id: 'invalid-syntax',
      label: 'Jsx content in json file - util'
    }).respondWithFile();

midway.route({
  id: 'url-with-dash',
  label: 'URL With Dash',
  path: '/api/checkout-customer/{cid}/shipping-address',
  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply);
  }
});

midway.route({
  id: 'header',
  label: 'Test Headers',
  path: '/api/testHeaders',
  handler: function (req, reply) {
    var headers = {
      header1: 'test1',
      header2: 'test2',
      header3: true
    };

    midway.util.respondWithFile(this, reply, {headers: headers});
  }
});

//Route for adding cookies to the path
midway.route({
  id: 'cookie',
  label: 'Test Cookies',
  path: '/api/testCookies',
  handler: function (req, reply) {
    var cookies = [
      {name: 'com.wm.customer', value: 'vz7.0b5c56'},
      {name: 'CID', value: 'SmockedCID', options: {domain: 'domain', path: '/'}},
      {name: 'anotherCookie', value: 'cookieValue'}
    ];

    midway.util.respondWithFile(this, reply, {cookies: cookies});
  }
});


//Route for returning image files
midway.route({
  id: 'images',
  label: 'Test Images',
  path: '/api/testImage',
  handler: function (req, reply) {
    midway.util.respondWithFile(this, reply);
  }
})

    .variant({
      id: 'image-respondWithFile',
      label: 'RespondWithFile-Image',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply);
      }
    })

    .variant({
      id: 'image-filepath',
      label: 'Image-Filepath',
      handler: function (req, reply) {
        midway.util.respondWithFile(this, reply, {filePath: './api/testImage/filePath-image-test.jpeg'});
      }
    });

// Route for returning a POST call
midway.route({
  id: 'postTest',
  label: 'postTest',
  path: '/foo',
  method: 'POST',
  handler: function (req, reply) {
    //req.payload should display the payload that was sent to request
    reply({message: 'POST SUCCESSFULL'});
  }
});

midway.route({
  id: 'helloSession',
  label: 'Hello session from Midway',
  path: '/helloSession',
  config: {
    cors: corsHeaders
  },

  variantLabel: 'hello from midway',
  handler: function (req, reply) {
    reply('Hello from Midway ' + req.query.midwaySessionId);
  }
})
  .variant({
    id: 'sessionVariant',
    label: 'Hello Session from Midway with session id',
    handler: function (req, reply) {
      reply({'message': 'Hello session variant from Midway ' + req.query.midwaySessionId});
    }
  });


//TODO THE route with id hapi-cors-hack IS A HACK FOR HAPI CORS HEADERS AND SHOULD BE REMOVED ONCE FIXED BY HAPI

var corsHeadersHack = {
  origin: ['*'],
  credentials: true,
  'access-control-allow-headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, ' +
  'X-Requested-With, Content-Type, WM_QOS.CORRELATION_ID',
  'testheader1': 'test1'
};

midway.route({
  id: 'hapi-cors-hack',
  label: 'HAPI-CORS-HACK',
  path: '/hapi/cors/hack',
  method: 'OPTIONS',
  config: {
    cors: corsHeadersHack
  },

  handler: function (req, reply) {
    reply();
  }
});

midway.route({
  id: 'hapi-cors-hack-dynamic',
  label: 'HAPI-CORS-HACK-DYNAMIC',
  path: '/hapi/cors/hack/{id}',
  method: 'OPTIONS',
  config: {
    cors: corsHeadersHack
  },

  handler: function (req, reply) {
    reply();
  }
});

midway.addGlobalVariant({
  id: 'anotherGlobalVariant',
  label: 'Global variant added after routes',
  handler: function (req, reply) {
    reply({global: 'this is another global variant'});
  }
});
