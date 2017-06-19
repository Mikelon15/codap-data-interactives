//=================================================================
//
//   Author: Miguel Gutierrez
//   Date: June 2017
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
//=================================================================
var ChartModel = function(){
  this.contextList = ['some random val'];
  // this.totalContexts = 0;
  // this.selected = {
  //   context: null,
  //
  // };
  this.changeContextCountEvent = new Event(this);
  // this.init()
};
ChartModel.prototype = {
  // init: function(){
  // },
  updateDataContextList: function(data){

    console.log(data);
    // getData().then(function(newContextList){
      // newContextList.forEach(function(context){
        // if(!this.hasContext(context)){
          // this.contextList.push(new Context(context.name, context.title, context.id));
          this.changeContextCountEvent.notify({
            // contextName: context.name
          });
          console.log(this.contextList);
        // }
    //   });
    // });
  },
  hasContext: function(context){
    return false;
  }

};
//This is the attribute object
var Attribute = function(name, id, collection, color){
  this.name = name || '';
  this.id = id || -1;
  this.collection = collection || '';
  this.color = color || 'white';
};
//this saves basic information for the context
// the functions will allow access to information about
// its attributes
var Context = function(name, title, id){
  this.name = name || '';
  this.title = title || '';
  this.id = id || '';
  this.collectionList = [];
  this.totalCollections = 0;
  this.attributeList = [];
  this.totalAttributes = 0;
};
