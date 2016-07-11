/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\OwnedAttribute.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/
var basicType=["boolean","integer","real","string","unlimitedNatural"];
function ownedAttribute(id,name,type,comment,assoc,isReadOnly,isOrdered){
    this.id=id;
    this.name=name;
    this.type=type;
    if (comment) this.description=comment.toYangDescription();
    this.association=assoc;
    this.config=!isReadOnly;
    this.nodeType;
    this.defaultValue;
    this.isUses=false;
    this.status;
    this.isAbstract=false;
    this.rpcType;
    this.key;
    this.path;
    this.support;
    this.isleafRef=true;
    this.isOrdered=isOrdered;
    this['min-elements'];
    this['max-elements'];
}

ownedAttribute.prototype.giveUnits=function(obj){
  var units;
  if (obj.ownedComment) {
    if (obj.ownedComment.body) {
      var text = obj.ownedComment.body;
      if (typeof text === 'string' && text.startsWith('_unit:')) {
        units = text.substring('_unit:'.length);
      }
    } else if (obj.ownedComment.array) {
      obj.ownedComment.array.map(function(item){
        var text = item.body.text();
        if (typeof text === 'string' && text.startsWith('_unit:')) {
          units = text.substring('_unit:'.length);
        }
      });
    }
  }
  this.units = units;
};

ownedAttribute.prototype.giveValue=function(obj){
    var value;
    if(obj.defaultValue){
        value = obj.defaultValue.attributes().value;
        if (value === null || value === undefined) {
          if (obj.defaultValue.attributes()['xmi:type'] === 'uml:LiteralBoolean') {
            value = false;
          } else if (obj.defaultValue.attributes()['xmi:type'] === 'uml:LiteralInteger') {
            value = 0;
          } else {
            // console.info('sko?', obj.defaultValue.attributes());
          }
        }
        if (obj.defaultValue.attributes()['xmi:type'] === 'uml:LiteralString') {
          value = ['"', value, '"'].join('');
        }
//        if(obj.defaultValue.value==undefined){
//            if(obj.defaultValue.attributes().name==undefined){
//                value=null;
//            }
//        }else{
//            value=obj.defaultValue.value.attributes()['xsi:nil'];
//        }
    }
    else{
        value=null
    }
    
    this.defaultValue=value;
    
    obj["lowerValue"]?value=obj["lowerValue"].attributes().value:value=null;
    this['min-elements']=value;
    obj["upperValue"]?value=obj["upperValue"].attributes().value:value=null;
    this['max-elements']=value;
};

ownedAttribute.prototype.giveNodeType=function(isLeaf){
    var isList;
    if(parseInt(this['max-elements']) > 1 || this['max-elements'] == "*"){
        isList=true;
    }else{
        isList=false;
    }
   switch (true){
       case isLeaf&&isList:this.nodeType="leaf-list";
           break;
       case isLeaf&&!isList:this.nodeType="leaf";
           this.isOrdered=undefined;
           break;
       case !isLeaf&&isList:this.nodeType="list";
           break;
       case !isLeaf&&!isList:this.nodeType="container";
           this.isOrdered=undefined;
           break;
       default:break;
   }
};
ownedAttribute.prototype.returnType=function(){
  for(var i=0;i<basicType.length;i++){
      if(this.type==basicType[i]){
          this.isleafRef=false;
         return "basicType";
      }
  }
    if(i==basicType.length){
        this.isUses=true;
        return this.type;
    }
};
module.exports=ownedAttribute;
