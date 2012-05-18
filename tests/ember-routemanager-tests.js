var JSHINTRC = {
    "predef": [
        "console",
        "Ember",
        "DS",
        "Handlebars",
        "Metamorph",
        "ember_assert",
        "ember_warn",
        "ember_deprecate",
        "ember_deprecateFunc",
        "require",
        "equal",
        "test",
        "testBoth",
        "testWithDefault",
        "raises",
        "deepEqual",
        "start",
        "stop",
        "ok",
        "strictEqual",
        "module",
        "expect",
        "minispade",
        "jQuery"
    ],

    "node" : false,
    "es5" : true,
    "browser" : true,

    "boss" : true,
    "curly": false,
    "debug": false,
    "devel": false,
    "eqeqeq": true,
    "evil": true,
    "forin": false,
    "immed": false,
    "laxbreak": false,
    "newcap": true,
    "noarg": true,
    "noempty": false,
    "nonew": false,
    "nomen": false,
    "onevar": false,
    "plusplus": false,
    "regexp": false,
    "undef": true,
    "sub": true,
    "strict": false,
    "white": false,
    "loopfunc": true
}
;

minispade.register('ember-routemanager/~tests/route_manager_test', "(function() {var routeManager;\n\nmodule('Ember.RouteManager', {\n  setup: function() {\n  },\n  \n  teardown: function() {\n    if(routeManager) {\n      routeManager.destroy();\n      window.location.hash = '';\n    }\n  }\n});\n\n\ntest('basic static paths', function() {\n  \n  var stateReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      \n      comments: Ember.State.create({\n        route: 'comments',\n        enter: function() {\n          stateReached = true;\n        }\n      })\n    })\n  });\n  \n  Ember.run(function() {\n    routeManager.set('location', '/posts/comments');\n  });\n  \n  ok(stateReached, 'The state should have been reached.');\n});\n\ntest('setting window.location explicitly should trigger', function() {\n  \n  stop();\n  expect(0);\n  \n  var timer = setTimeout(function() {\n    ok(false, 'route change was not notified within 2 seconds');\n    start();\n  }, 2000);\n  \n  routeManager = Ember.RouteManager.create({\n    home: Ember.State.create({\n      route: 'home',\n      enter: function() {\n        start();\n        clearTimeout(timer);\n      }\n    })\n  });\n  \n  routeManager.start();\n  \n  window.location.hash = 'home';\n  \n});\n\ntest('complex static paths', function() {\n  \n  var stateReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      \n      comments: Ember.State.create({\n        route: 'comments/all',\n        enter: function() {\n          stateReached = true;\n        }\n      })\n    })\n  });\n  \n  routeManager.set('location', '/posts/comments/all');\n  \n  ok(stateReached, 'The state should have been reached.');\n});\n\n\ntest('paths with parameters', function() {\n  \n  var commentId;\n  var postId;\n  \n  routeManager = Ember.RouteManager.create({\n    post: Ember.State.create({\n      route: 'posts/:postId',\n      enter: function(stateManager) {\n        postId = stateManager.params.postId;\n      },\n      \n      comment: Ember.State.create({\n        route: 'comments/:commentId',\n        enter: function(stateManager) {\n          commentId = stateManager.params.commentId;\n        }\n      })\n    })\n  });\n  \n  routeManager.set('location', '/posts/1/comments/4');\n  \n  equal(postId, 1, \"The first param should have been set.\");\n  equal(commentId, 4, \"The second param should have been set.\");\n});\n\ntest('states without paths should automatically be entered', function() {\n  var stateReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    post: Ember.State.create({\n      route: 'posts/:postId',\n      admin: Ember.State.create({\n        edit: Ember.State.create({\n          route: 'edit',\n          enter: function() {\n            this._super();\n            stateReached = true;\n          }\n        })\n      })\n      \n    })\n  });\n  \n  routeManager.set('location', '/posts/1/edit');\n  \n  ok(stateReached, 'the state should have been reached.');\n});\n\ntest(\"wildcard paths\", function() {\n  var stateReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      \n      comments: Ember.State.create({\n        route: '*',\n        enter: function() {\n          stateReached = true;\n        }\n      })\n    })\n  });\n  \n  routeManager.set('location', '/posts/comments');\n  \n  ok(stateReached, 'The state should have been reached.');\n});\n\ntest(\"regexp paths\", function() {\n  var stateReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: /p.*/,\n      \n      comments: Ember.State.create({\n        route: 'comments',\n        enter: function() {\n          stateReached = true;\n        }\n      })\n    })\n  });\n  \n  routeManager.set('location', '/posts/comments');\n\n  ok(stateReached, 'The state should have been reached.');\n});\n\ntest(\"regexp paths with named captures\", function() {\n  var stateReached = false;\n  var year, month, day;\n\n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      archive: Ember.State.create({\n        route: /(\\d{4})-(\\d{2})-(\\d{2})/,\n        captures: ['year', 'month', 'day'],\n        enter: function(stateManager) {\n          stateReached = true;\n          year = stateManager.params.year;\n          month = stateManager.params.month;\n          day = stateManager.params.day;\n        }\n      })\n    })\n  });\n\n  routeManager.set('location', '/posts/2012-08-21');\n\n  ok(stateReached, 'The state should have been reached.');\n\n  equal(year, '2012', \"The first match param (year) should have been set.\");\n  equal(month, '08', \"The second match param (month) should have been set.\");\n  equal(day, '21', \"The first match param (day) should have been set.\");\n});\n\ntest(\"state priorities are obeyed\", function() {\n  var stateReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    route1: Ember.State.create({\n      route: 'test',\n      priority: 1\n    }),\n    route2: Ember.State.create({\n      route: 'test',\n      priority: 3,\n      enter: function() {\n        stateReached = true;\n      }\n    }),\n    route3: Ember.State.create({\n      route: 'test',\n      priority: -1\n    }),\n    route4: Ember.State.create({\n      route: 'test',\n      priority: 1\n    })\n  });\n  \n  routeManager.set('location', '/test');\n  \n  ok(stateReached, 'The state should have been reached.');\n});\n\ntest(\"routes will reach pathless leaf states\", function() {\n  var stateReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    post: Ember.State.create({\n      route: 'posts',\n      \n      show: Ember.State.create({\n        enter: function() {\n          stateReached = true;\n        }\n      })\n      \n    })\n  });\n  \n  routeManager.set('location', '/posts');\n  \n  ok(stateReached, 'The state should have been reached.');\n});\n\ntest('routes will enter a pathless home state', function() {\n  \n  var postsReached = false;\n  var commentsReached = false;\n  var homeReached = false;\n  \n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      enter: function() {\n        postsReached = true;\n      },\n      \n      comments: Ember.State.create({\n        route: 'comments',\n        enter: function() {\n          commentsReached = true;\n        }\n      })\n    }),\n    \n    home: Ember.State.create({\n      enter: function() {\n        homeReached = true;\n      }\n    })\n  });\n  \n  routeManager.set('location', '/'); \n  ok(homeReached, 'The home state should have been reached.');\n  \n  homeReached = false;\n  \n  routeManager.set('location', '/posts');\n  ok(!postsReached, 'Only leaf states can be routed to');\n  \n  routeManager.set('location', '/posts/comments');\n  \n  ok(postsReached, 'Intermediary state should have been reached.');\n  ok(commentsReached, 'Leaf state should have been reached');\n  ok(!homeReached, 'The home state should not have been reached.');\n  equal(routeManager.get('currentState'), routeManager.getPath('posts.comments'), \"The current state should be set correctly.\");\n});\n\ntest(\"a parameter only location change will re-trigger state transitions correctly\", function() {\n  var postsEnterCount = 0;\n  var postsExitCount = 0;\n  var showEnterCount = 0;\n  var showExitCount = 0;\n  var commentsEnterCount = 0;\n  var commentsExitCount = 0;\n  \n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      enter: function() {\n        postsEnterCount++;\n      },\n      exit: function() {\n        postsExitCount++;\n      },\n      post: Ember.State.create({\n        route: ':postId',\n        show: Ember.State.create({\n          enter: function() {\n            showEnterCount++;\n          },\n          exit: function() {\n            showExitCount++;\n          }\n        }),\n        comments: Ember.State.create({\n          route: 'comments',\n          enter: function() {\n            commentsEnterCount++;\n          },\n          exit: function() {\n            commentsExitCount++;\n          }\n        })\n      \n      })\n    })\n  });\n  \n  routeManager.set('location', '/posts/1/comments');\n  \n  equal(postsEnterCount, 1, 'posts enter count');\n  equal(postsExitCount, 0, 'posts exit count');\n  equal(commentsEnterCount, 1, 'comments enter count');\n  equal(commentsExitCount, 0, 'comments exit count');\n  equal(showEnterCount, 0, 'show enter count');\n  equal(showExitCount, 0, 'show exit count');\n  \n  routeManager.set('location', '/posts/2/comments');\n  \n  equal(postsEnterCount, 1, 'posts enter count');\n  equal(postsExitCount, 0, 'posts exit count');\n  equal(commentsEnterCount, 2, 'comments enter count');\n  equal(commentsExitCount, 1, 'comments exit count');\n  equal(showEnterCount, 0, 'show enter count');\n  equal(showExitCount, 0, 'show exit count');\n  \n  routeManager.set('location', '/posts/2');\n  \n  equal(routeManager.params.postId, 2, \"post id parameter\");\n  equal(postsEnterCount, 1, 'posts enter count');\n  equal(postsExitCount, 0, 'posts exit count');\n  equal(commentsEnterCount, 2, 'comments enter count');\n  equal(commentsExitCount, 2, 'comments exit count');\n  equal(showEnterCount, 1, 'show enter count');\n  equal(showExitCount, 0, 'show exit count');\n  \n  routeManager.set('location', '/posts/3');\n  \n  equal(routeManager.params.postId, 3, \"post id parameter\");\n  equal(postsEnterCount, 1, 'posts enter count');\n  equal(postsExitCount, 0, 'posts exit count');\n  equal(commentsEnterCount, 2, 'comments enter count');\n  equal(commentsExitCount, 2, 'comments exit count');\n  equal(showEnterCount, 2, 'show enter count');\n  equal(showExitCount, 1, 'show exit count');\n});\n\ntest(\"path only parameter change on a root state should work\", function() {\n  var enterCount = 0;\n  routeManager = Ember.RouteManager.create({\n    post: Ember.State.create({\n      route: 'posts/:postId',\n      enter: function(stateManager) {\n        enterCount++;\n      }\n    })\n  });\n  \n  routeManager.set('location', '/posts/1');\n  equal(enterCount, 1, 'enter count');\n  routeManager.set('location', '/posts/1');\n  equal(enterCount, 1, 'enter count');\n  routeManager.set('location', '/posts/2'); \n  equal(enterCount, 2, 'enter count');\n});\n\ntest(\"should obey the 404 state\", function() {\n  var section1Count = 0;\n  var homeCount = 0;\n  var _404count = 0;\n  \n  routeManager = Ember.RouteManager.create({\n    section1: Ember.State.create({\n      route: 'section1',\n      enter: function() {\n        section1Count++;\n      }\n    }),\n    home: Ember.State.create({\n      enter: function() {\n        homeCount++;\n      }\n    }),\n    \"404\": Ember.State.create({\n      enter: function() {\n        _404count++;\n      }\n    })\n  });\n  \n  routeManager.set('location', '/');\n  \n  equal(section1Count, 0, 'section1 count');\n  equal(homeCount, 1, 'home count');\n  equal(_404count, 0, '404 count');\n  \n  routeManager.set('location', '/section1');\n  \n  equal(section1Count, 1, 'section1 count');\n  equal(homeCount, 1, 'home count');\n  equal(_404count, 0, '404 count');\n  \n  routeManager.set('location', '/this-is-a-bad-route');\n  \n  equal(section1Count, 1, 'section1 count');\n  equal(homeCount, 1, 'home count');\n  equal(_404count, 1, '404 count');\n  \n  routeManager.set('location', '/section1');\n  \n  equal(section1Count, 2, 'section1 count');\n  equal(homeCount, 1, 'home count');\n  equal(_404count, 1, '404 count');\n  \n  routeManager.set('location', '/this-is-another/bad/route');\n  \n  equal(section1Count, 2, 'section1 count');\n  equal(homeCount, 1, 'home count');\n  equal(_404count, 2, '404 count');\n});\n\ntest(\"should obey synchronous load methods\", function() {\n  var isAdmin = true;\n  var editEnterCount = 0;\n  var showEnterCount = 0;\n  var altEnterCount = 0;\n  var postId;\n  \n  var showEnabled = true;\n  var altEnabled = false;\n  \n  routeManager = Ember.RouteManager.create({\n    post: Ember.State.create({\n      route: 'posts/:postId',\n      enter: function(stateManager) {\n        postId = stateManager.params.postId;\n      },\n      show: Ember.State.create({\n        load: function() { return showEnabled; },\n        enter: function() {\n          showEnterCount++;\n        }\n      }),\n      alt: Ember.State.create({\n        load: function() { return altEnabled; },\n        enter: function() {\n          altEnterCount++;\n        }\n      }),\n      admin: Ember.State.create({\n        load: function() { return isAdmin; },\n        edit: Ember.State.create({\n          route: 'edit',\n          enter: function() {\n            editEnterCount++;\n          }\n        })\n      })\n      \n    })\n  });\n  \n  routeManager.set('location', '/posts/1/edit');\n  equal(editEnterCount, 1, 'The edit state should have been entered once.');\n  equal(showEnterCount, 0, ' The show state should not have been entered.');\n  equal(altEnterCount, 0, 'The alt state should not have been entered.');\n  \n  routeManager.set('location', '/posts/1');\n  isAdmin = false;\n  equal(editEnterCount, 1, 'The edit state should have been entered once.');\n  equal(showEnterCount, 1, ' The show state should have been entered once.');\n  equal(altEnterCount, 0, 'The alt state should not have been entered.');\n  \n  routeManager.set('location', '/posts/1/edit');\n  equal(editEnterCount, 1, 'The edit state should not have been entered again.');\n  equal(showEnterCount, 1, 'The show state should not have been entered again.');\n  equal(altEnterCount, 0, 'The alt state should not have been entered.');\n  \n  showEnabled = false;\n  altEnabled = true;\n  routeManager.set('location', '/posts/1');\n  equal(editEnterCount, 1, 'The edit state should not have been entered again.');\n  equal(showEnterCount, 1, 'The show state should not have been entered again.');\n  equal(altEnterCount, 1, 'The alt state should have been entered.');\n});\n\ntest(\"should obey asynchronous load methods\", function() {\n  \n  stop();\n  \n  var homeEnterCount = 0;\n  var adminEnterCount = 0;\n  \n  routeManager = Ember.RouteManager.create({\n    home: Ember.State.create({\n      enter: function() { homeEnterCount++; }\n    }),\n    \n    admin: Ember.State.create({\n      route: 'admin',\n      enter: function() { adminEnterCount++; },\n      load: function(routeManager, params, transition, context) {\n        transition.async();\n        setTimeout(function() {\n          start();\n          transition.ok();\n          equal(homeEnterCount, 1, 'home enter count');\n          equal(adminEnterCount, 1, 'admin enter count');\n        }, 100);\n      }\n    })\n  });\n  \n  routeManager.set('location', '/');\n  \n  equal(homeEnterCount, 1, 'home enter count');\n  equal(adminEnterCount, 0, 'admin enter count');\n  \n  routeManager.set('location', '/admin');\n  \n  equal(adminEnterCount, 0, 'should be entered async');\n});\n\ntest(\"should be able to change location before async routing is finished\", function() {\n  stop();\n  \n  var homeEnterCount = 0;\n  var adminEnterCount = 0;\n  \n  routeManager = Ember.RouteManager.create({\n    home: Ember.State.create({\n      enter: function() { homeEnterCount++; }\n    }),\n    \n    admin: Ember.State.create({\n      route: 'admin',\n      enter: function() { adminEnterCount++; },\n      load: function(routeManager, params, transition, context) {\n        transition.async();\n        setTimeout(function() {\n          transition.ok();\n        }, 100);\n      }\n    })\n  });\n  \n  routeManager.set('location', '/');\n  \n  equal(homeEnterCount, 1, 'home enter count');\n  equal(adminEnterCount, 0, 'admin enter count');\n  \n  routeManager.set('location', '/admin');\n  routeManager.set('location', '/');\n  \n  equal(homeEnterCount, 1, 'home enter count');\n  equal(adminEnterCount, 0, 'admin enter count');\n  \n  setTimeout(function() {\n    start();\n    equal(homeEnterCount, 1, 'home enter count');\n    equal(adminEnterCount, 0, 'admin enter count');\n  }, 200);\n});\n\ntest(\"should support documentTitle property on states\", function() {\n  routeManager = Ember.RouteManager.create({\n    documentTitle: 'Blog',\n    post: Ember.State.create({\n      route: 'post',\n      documentTitle: 'Cool Article'\n    }),\n    home: Ember.State.create({\n    })\n  });\n  routeManager.set('location', '/');\n  equal(document.title, 'Blog', 'should use parents title if not set');\n  routeManager.set('location', '/post');\n  equal(document.title, 'Cool Article');\n  routeManager.post.set('documentTitle', 'New Title');\n  equal(document.title, 'New Title', 'document title should observe property changes');\n});\n\ntest(\"should support relative locations\", function() {\n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      index: Ember.State.create(),\n      post: Ember.State.create({\n        route: ':postId'\n      })\n    }),\n    home: Ember.State.create({\n    })\n  });\n  routeManager.set('location', '/');\n  routeManager.set('location', '..');\n  equal(routeManager.currentState, routeManager.home, \"parent path on the root state should still result in the root state\");\n  \n  routeManager.set('location', '/posts/1/');\n  equal(routeManager.currentState, routeManager.posts.post, \"absolute location\");\n  \n  routeManager.set('location', '..');\n  equal(routeManager.currentState, routeManager.posts.index, \"relative location: parent\");\n  \n  routeManager.set('location', '/posts/1');\n  routeManager.set('location', '..');\n  equal(routeManager.currentState, routeManager.home, \"relative location: parent no trailing slash\");\n  \n  routeManager.set('location', '/posts/1');\n  routeManager.set('location', '2');\n  equal(routeManager.currentState, routeManager.posts.post, \"relative location: sibling\");\n  equal(routeManager.getPath('params.postId'), 2, \"correct parameter\");\n  \n  routeManager.set('location', '/posts/1/');\n  routeManager.set('location', '../..');\n  equal(routeManager.currentState, routeManager.home, \"relative location: multiple parents\");\n});\n\ntest(\"should be able to populate context\", function() {\n  routeManager = Ember.RouteManager.create({\n    posts: Ember.State.create({\n      route: 'posts',\n      index: Ember.State.create(),\n      post: Ember.State.create({\n        route: ':postId',\n        load: function(routeManager, params, transition, context) {\n          context.name = \"Post \" + params.postId;\n          return true;\n        },\n        show: Ember.State.create(),\n        comments: Ember.State.create({\n          route: 'comments',\n          load: function(routeManager, params, transition, context) {\n            context.inComments = true;\n            equal(context.name, \"Post \" + params.postId, \"parent context properties should be accessible\");\n            return true;\n          },\n        })\n      })\n    }),\n    home: Ember.State.create({\n      load: function(routeManager, params, transition, context) {\n        context.inHome = true;\n        ok(!context.name, \"previously set context properties should not be accessible\");\n        return true;\n      },\n    })\n  });\n  \n  routeManager.set('location', '/');\n  routeManager.set('location', '/posts/1/comments');\n  \n  equal(routeManager.getPath('context.name'), \"Post 1\", \"context property should be set\");\n  \n  routeManager.set('location', '/posts/1/');\n  \n  ok(!routeManager.getPath('context.inComments'), \"context property should be unset\");\n  \n  routeManager.set('location', '/');\n});\n\ntest(\"async states with route overlap\", function() {\n  var showEnterCount = 0;\n  var showEnterCallback;\n  var editEnterCount = 0;\n  var editEnterCallback;\n  routeManager = Ember.RouteManager.create({\n    posts1: Ember.State.create({\n      route: 'posts/:postId',\n      show: Ember.State.create({\n        load: function(routeManager, params, transition, context) {\n          transition.async();\n          setTimeout(function() {\n            transition.ok();\n          }, 1);\n        },\n        enter: function() {\n          showEnterCount++;\n          if(showEnterCallback) {\n            showEnterCallback();\n          }\n        }\n      })\n    }),\n    posts2: Ember.State.create({\n      route: 'posts/:postId',\n      edit: Ember.State.create({\n        route: 'edit',\n        load: function(routeManager, params, transition, context) {\n          transition.async();\n          setTimeout(function() {\n            transition.ok();\n          }, 1);\n        },\n        enter: function() {\n          editEnterCount++;\n          if(editEnterCallback) {\n            editEnterCallback();\n          }\n        }\n      })\n    }),\n    home: Ember.State.create({\n    }),\n    \"404\":  Ember.State.create({\n    })\n  });\n\n  stop();\n\n  var timerId = setTimeout(function() {\n    start();\n  }, 100);\n\n  routeManager.set('location', '/posts/1');\n\n  showEnterCallback = function() {\n    equal(showEnterCount, 1, \"show enter count is correct\");\n    equal(editEnterCount, 0, \"edit enter count is correct\");\n\n    routeManager.set('location', '/posts/1/edit');\n\n    editEnterCallback = function() {\n      equal(showEnterCount, 1, \"show enter count is correct\");\n      equal(editEnterCount, 1, \"edit enter count is correct\");\n\n      start();\n\n      clearTimeout(timerId);\n    };\n  };\n\n});\n})();\n//@ sourceURL=ember-routemanager/~tests/route_manager_test");