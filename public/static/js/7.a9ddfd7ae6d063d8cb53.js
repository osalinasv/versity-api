webpackJsonp([7],{Cnji:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("Dd8w"),s=a.n(i),m=a("NYxO"),n={name:"Profile",beforeMount:function(){this.mFirstName=this.firstName,this.mLastName=this.lastName},data:function(){return{mFirstName:"",mLastName:"",email:""}},methods:{onSubmit:function(){}},computed:s()({},Object(m.d)(["firstName","lastName"]),Object(m.b)(["fullName"]))},r={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("main",{attrs:{id:"profile"}},[a("header",{staticClass:"grid-container"},[a("h1",[e._v("Perfíl")]),e._v(" "),a("p",[e._v("Bienvenido a la configuracion de tu perfil, "+e._s(e.fullName))])]),e._v(" "),a("section",{staticClass:"grid-container margin_top--two"},[a("form",{on:{submit:function(t){t.preventDefault(),e.onSubmit(t)}}},[a("p",{staticClass:"input-field"},[a("label",{attrs:{for:"firstName"}},[e._v("Nombre(s)")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.mFirstName,expression:"mFirstName"}],attrs:{type:"text",name:"firstName",placeholder:"Nombre"},domProps:{value:e.mFirstName},on:{input:function(t){t.target.composing||(e.mFirstName=t.target.value)}}})]),e._v(" "),a("p",{staticClass:"input-field"},[a("label",{attrs:{for:"lastName"}},[e._v("Apellido(s)")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.mLastName,expression:"mLastName"}],attrs:{type:"text",name:"lastName",placeholder:"Apellido"},domProps:{value:e.mLastName},on:{input:function(t){t.target.composing||(e.mLastName=t.target.value)}}})]),e._v(" "),a("p",{staticClass:"input-field"},[a("label",{attrs:{for:"email"}},[e._v("Email")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"email",name:"email",placeholder:"Email"},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}})]),e._v(" "),a("button",{staticClass:"margin_top--two",attrs:{type:"submit"}},[e._v("Guardar cambios")])])])])},staticRenderFns:[]};var l=a("VU/8")(n,r,!1,function(e){a("RHIk")},null,null);t.default=l.exports},RHIk:function(e,t){}});
//# sourceMappingURL=7.a9ddfd7ae6d063d8cb53.js.map