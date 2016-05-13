// ==========================================================================
//  
//  Author:   jsandoe
//
//  Copyright (c) 2016 by The Concord Consortium, Inc. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// ==========================================================================
/* jshint strict: false */
/*global console:true,iframePhone:true,React:true, ReactDOM:true */
/**
 * dataManager responsible for managing the CaseTableApp's state:
 *
 */
var dataManager = Object.create({

  /**
   * @property data {{
   *   contexts: {[string]},
   *   currentContext: {string},
   *
   * }}
   */
  data: null,

  init: function () {
    this.listeners = [];
    this.data = {
        contexts: [],
        currentContext: null,
        collections: [],
        proto: null
      };
    return this;
  },

  register: function (listener) {
    this.listeners = this.listeners || [];
    this.listeners.push(listener);
    listener.setState(this.data);
  },

  unregister: function (listener) {
    this.listeners = this.listeners || [];
    var ix = this.listeners.indexOf(listener);
    if (ix >= 0) {
      this.listeners.splice(ix, 1);
    }
  },

  notify: function () {
    this.listeners.forEach(function (listener) {
      listener.setState(this.data);
    }.bind(this));
  },

  setContextList: function (contextList) {
    function fetchContext(contextName) {
      dispatcher.sendRequest({action: 'get', resource: 'dataContext[' + contextName + ']'});
    }
    this.data.contexts = contextList;
    if (contextList.length > 0) {
      fetchContext(contextList[0].name);
    }
    this.notify();
  },

  setDataCards: function (context) {
    function fetchFirstCase(contextName, collectionName) {
      dispatcher.sendRequest({action: 'get', resource: 'dataContext[' +
        contextName + '].collection[' + collectionName + '].caseByIndex[0]'});
    }
    this.data.currentContext = context.name;
    this.data.collections = context.collections;
    this.data.collections.forEach(function(collection) {
      collection.currentCaseIndex = 0;
      var contextName = this.data.currentContext;
      fetchFirstCase(contextName, collection.name);
    }.bind(this));
    this.data.hasSelectedContext = true;
    this.notify();
  },

  setCase: function (iCollectionName, values) {
    function guaranteeLeftCollectionIsParent(parentCollection, parentID, context) {
      var parentCase = parentCollection.currentCase;
      var resource;
      if (parentCase && parentCase.guid !== parentID) {
        resource = 'dataContext[' + context + '].collection[' +
            parentCollection.name + '].caseByID[' + parentID + ']';
        dispatcher.sendRequest({action: 'get', resource: resource});
      }
    }

    function guaranteeRightCollectionIsChild(childCollection, myCase, context) {
      var childCase = childCollection.currentCase;
      var resource;
      if (childCase && childCase.parent !== myCase.guid) {
        if (myCase.children) {
          resource = 'dataContext[' + context + '].collection[' +
              childCollection.name + '].caseByID[' + myCase.children[0] + ']';
          dispatcher.sendRequest({action: 'get', resource: resource});
        }
      }
    }

    var myCase = values.case;
    var caseIndex = values.caseIndex;
    var collections = this.data.collections;
    var collectionIndex = collections.findIndex(function (coll) {
      return coll.name === iCollectionName;
    });
    dispatcher.sendRequest({action: 'create', resource: 'dataContext[' + this.data.currentContext + '].selectionList', values: [myCase.guid]});
    if (collectionIndex >= 0) {
      var collection = collections[collectionIndex];
      collection.currentCaseIndex = Number(caseIndex);
      collection.currentCase = myCase;
      if (collectionIndex > 0) {
        guaranteeLeftCollectionIsParent(collections[collectionIndex - 1],
            myCase.parent, this.data.currentContext);
      }
      if (collectionIndex < collections.length - 1) {
        guaranteeRightCollectionIsChild(collections[collectionIndex + 1],
            myCase, this.data.currentContext);
      }
      this.notify();
    }
  },

  findCollectionForAttribute: function (iAttributeName) {
    return this.data.collections.find(function (collection) {
      var attr = collection.attrs.find(function (attr) { return attr.name === iAttributeName; });
      return attr != undefined;
    });
  },

  findCollectionForName: function (iCollectionName) {
    return this.data.collections.find(function (collection) {
      return (collection.name === iCollectionName);
    });
  },

  updateCurrentCaseValue: function (iAttributeName, iValue) {
    var collection = this.findCollectionForAttribute(iAttributeName);
    var currentCase = collection && collection.currentCase;
    var values = currentCase && currentCase.values;
    if (values) {
      values[iAttributeName] = iValue;
      this.notify();
    }
  },

  getContextName: function () {
    return this.data.currentContext;
  },
  getCurrentCase: function (iCollectionName) {
    var collection = this.findCollectionForName(iCollectionName);
    if (collection) {
      return collection.currentCase;
    }
  },
  getCurrentCaseIndex: function (iCollectionName) {
    var collection = this.findCollectionForName(iCollectionName);
    if (collection) {
      return collection.currentCaseIndex;
    }
  },

  moveCard: function (iCollectionName, action) {
    function requestCase(contextName, collectionName, index) {
      var resource = 'dataContext[' + contextName + '].collection[' + collectionName + '].caseByIndex[' + index + ']';
      dispatcher.sendRequest({action: 'get', resource: resource});
    }

    var collection = this.data.collections.find(function (col) {
      return col.name === iCollectionName;
    });
    var contextName = this.data.currentContext;
    var currentCaseIndex = collection.currentCaseIndex;
    console.log('moveCard: action: ' + action);
    switch (action) {
      case 'prev':
        requestCase(contextName, iCollectionName, currentCaseIndex - 1);
        break;
      case 'next':
        requestCase(contextName, iCollectionName, currentCaseIndex + 1);
        break;
      case 'new':
        this.startNewCase(iCollectionName, currentCaseIndex);
        break;
      case 'remove':
        console.log('Remove not implemented.');
        break;
      default:
    }
  },
  startNewCase: function () {},

  getState: function () {
    return this.data;
  }

}).init();

/**
 * dispatcher is responsible for routing actions
 *
 * @type {Object}
 */
var dispatcher = Object.create({
/*
    connection: null,
    connectionState: 'uninitialized',
    connectionSendCount: 0,
*/
    init: function () {
      this.connection = new iframePhone.IframePhoneRpcEndpoint(function () {
      }, "data-interactive", window.parent);
      this.connectionState = 'initialized';
      this.sendRequest({
        action: 'update', resource: 'interactiveFrame', values: {
          "title": "Data Card",
          "version": "0.1",
          "dimensions": { "width": 500, "height": 600}
        }
      });
      this.sendRequest({
        "action": "get",
        "resource": "dataContextList"
      });
      return this;
    },

    sendRequest: function (request) {
      this.connection.call(request, function (response) {
        this.handleResponse(request, response);
      }.bind(this));
    },

    parseResourceSelector: function (iResource) {
      var selectorRE = /([A-Za-z0-9_]+)\[([A-Za-z0-9_]+)\]/;
      var result = {};
      var selectors = iResource.split('.');
      selectors.forEach(function (selector) {
        var resourceType, resourceName;
        var match = selectorRE.exec(selector);
        if (selectorRE.test(selector)) {
          resourceType = match[1];
          resourceName = match[2];
          result[resourceType] = resourceName;
          result.type = resourceType;
        } else {
          result.type = selector;
        }
      });

      return result;
    },

    handleResponse: function (request, result) {
      var resourceObj = this.parseResourceSelector(request.resource);
      if (!result) {
        console.log('Request to CODAP timed out: ' + JSON.stringify(request));
        this.connectionState = 'timed-out';
      } else if (!result.success) {
        console.log('Request to CODAP Failed: ' + JSON.stringify(request));
        this.connectionState = 'active';
      } else if (request.action === 'get') {
        this.connectionState = 'active';
        switch (resourceObj.type) {
          case 'dataContextList':
            dataManager.setContextList(result.values);
            break;
          case 'dataContext':
            dataManager.setDataCards(result.values);
            break;
          case 'caseByIndex':
          case 'caseByID':
            dataManager.setCase(resourceObj.collection, result.values);
            break;
          default:
            console.log('No handler for get response: ' + request.resource);
        }
      } else {
        this.connectionState = 'active';
      }
    },

    updateCaseValue: function (attributeName, value) {
      dataManager.updateCurrentCaseValue(attributeName, value);
    },

    updateCurrentCase: function (iCollectionName) {
      var myContext = dataManager.getContextName();
      var myCase = dataManager.getCurrentCase(iCollectionName);
      var resource = 'dataContext[' + myContext + '].collection[' +
          iCollectionName + '].caseByID[' + myCase.guid + ']';
      this.sendRequest({
        action: 'update',
        resource: resource,
        values: myCase});
    }
  }).init();

/**
 * ContextMenu provides list of DataContexts present in CODAP and an interface for
 * selecting one.
 * @type {ClassicComponentClass<P>}
 */
var ContextMenu = React.createClass({
  propTypes: {
    contexts: React.PropTypes.array.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  render: function () {
    var onSelect = this.props.onSelect;
    var options = this.props.contexts.map(function (context) {
      var title = context.title || context.name;
      return (
          <option key={context.name} id={context.name}>{title}</option>
      );
    });
    return <section id="context-selector" >
      <label>Context:&nbsp;
        <select id="context-selector" onChange={function (ev) {onSelect(ev.target.value)}} >{options}</select>
      </label >
    </section>
  }
});

/**
 * AttrList presents a list of attributes for a data card.
 * @type {ClassicComponentClass<P>}
 */
var AttrList = React.createClass({
  propTypes: {
    attrs: React.PropTypes.array.isRequired
  },
  render: function () {
    var items = this.props.attrs.map(function (item) {
      var title = item.title || item.name;
      return <div key={item.name} className="attr">{title}</div>
    });
    return <div className="attr-list">{items}</div>
  }
});

var CaseValue = React.createClass ({
  propTypes: {
    value: React.PropTypes.node.isRequired,
    name: React.PropTypes.string.isRequired
  },
  handleChange: function (ev) {
    dispatcher.updateCaseValue(this.props.name, ev.target.value);
  },
  render: function () {
    return <input type="text" className="attr-value" key={this.props.name} value={this.props.value}
                  onChange={this.handleChange} />;
  }
});

var CaseDisplay = React.createClass ({
  propTypes: {
    myCase: React.PropTypes.object,
    attrs: React.PropTypes.array.isRequired
  },
  render: function () {
    var myCase = this.props.myCase;
    var values = this.props.attrs.map(function (attr) {
      var value = myCase? myCase.values[attr.name]: '';
      return <CaseValue className="attr-value" key={attr.name} name={attr.name} value={value} />;
    });
    return <div className="case">{values}</div>;
  }
});

var CaseList = React.createClass({
  propTypes: {
    collection: React.PropTypes.object.isRequired
  },
  render: function () {
    //var caseIndex = this.props.collection.currentCaseIndex || 0;
    var myCase = this.props.collection.currentCase;
    var id = myCase? myCase.guid: 'new';
    var caseView = <CaseDisplay key={id} attrs={this.props.collection.attrs} myCase={myCase}/>;
    return <div className="case-container"> {caseView} </div>;
  }
});

var CaseNavControl = React.createClass({
  propTypes: {
    onNavigation: React.PropTypes.func.isRequired,
    action: React.PropTypes.string.isRequired
  },
  symbol: {
    prev: '<',
    next: '>',
    new: '+',
    remove: 'x'
  },
  handleClick: function (/*ev*/) {
    if (this.props.onNavigation) {
      this.props.onNavigation(this.props.action);
    }
  },
  render: function () {
    return <div className="control" onClick={this.handleClick}>{this.symbol[this.props.action]}</div>
  }
});

var DataCard = React.createClass({
  propTypes: {
    context: React.PropTypes.string.isRequired,
    collection: React.PropTypes.object.isRequired,
    onNavigation: React.PropTypes.func.isRequired
  },
  moveCard: function (action) {
    this.props.onNavigation(this.props.collection.name, action);
  },
  handleUpdateCase: function (/*ev*/) {
    dispatcher.updateCurrentCase(this.props.collection.name);
  },
  render: function () {
    var collection = this.props.collection;
    var title = collection.title || collection.name;
    return <section className="card-section">
      <div className="collection-name">{title}</div>
      <div className="card-deck">
        <div className="left-ctls">
          <CaseNavControl action="prev" onNavigation={this.moveCard} />
        </div>
        <div className="card-content">
          <div className="case-display">
            <div className="attr-container">
              <AttrList attrs={collection.attrs} />
            </div>
            <div className="case-frame">
              <CaseList collection={collection} />
            </div>
            </div>
          <input type="button" className="update-case" onClick={this.handleUpdateCase} value="Update" />
        </div>
        <div className="right-ctls">
          <CaseNavControl action="next"  onNavigation={this.moveCard}/>
          <CaseNavControl action="new"  onNavigation={this.moveCard}/>
          <CaseNavControl action="remove"  onNavigation={this.moveCard}/>
        </div>
      </div>
    </section>
  }
});

var DataCardApp = React.createClass({
  navigate: function (collectionName, direction) {
    dataManager.moveCard(collectionName, direction);
    this.didChange();
  },

  didChange: function (/*state*/) {
    this.setState(dataManager.getState());
  },

  getInitialState: function () {
    return {
      contexts: [],
      currentContext: null,
      collections: []
    };
  },

  componentDidMount: function () {
    dataManager.register(this);
  },

  componentWillUnmount: function () {
    dataManager.unregister(this);
  },

  contextSelectHandler: function (contextName) {
    dispatcher.sendRequest({action: 'get', resource: 'dataContext[' + contextName + ']'});
  },

  render: function () {
    var ix = 0;
    var cards = this.state.collections.map(function (collection){
      return <DataCard key={'collection' + ix++}
                       context={this.state.currentContext}
                       collection={collection}
                       onNavigation={this.navigate} />
    }.bind(this));
    return <div>
      <ContextMenu contexts={this.state.contexts} onSelect={this.contextSelectHandler} />
      {cards}
    </div>
  }
});

ReactDOM.render(<DataCardApp data={dataManager} />,
    document.getElementById('container'));

