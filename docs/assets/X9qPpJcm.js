import{_ as l}from"./W6P5zNgQ.js";import{_ as d,o as n,m as f,w as m,c,a as t}from"./Cgxmrr0S.js";const p=""+new URL("QVC.CMajLVUU.svg",import.meta.url).href,g={name:"Logo",data(){return{isAnimating:!1}},methods:{shimmer(){if(this.isAnimating)return;this.isAnimating=!0,this.$refs.logoSvg.querySelectorAll("animateMotion").forEach(e=>{e.beginElement()}),setTimeout(()=>{this.isAnimating=!1},1e3)}}};function h(a,o,e,u,_,i){const r=l;return n(),f(r,{to:"/",class:"logo"},{default:m(()=>[(n(),c("svg",{ref:"logoSvg",height:"100%",width:"100%",viewBox:"0 0 20 10",onMouseover:o[0]||(o[0]=(...s)=>i.shimmer&&i.shimmer(...s))},o[1]||(o[1]=[t("defs",null,[t("mask",{id:"logo-mask",height:"100%",width:"100%"},[t("image",{href:p,height:"100%",width:"100%"})]),t("radialGradient",{id:"radial-gradient",cx:"50%",cy:"50%",r:"50%",fx:"50%",fy:"50%"},[t("stop",{offset:"0%",style:{"stop-color":"var(--red)","stop-opacity":"1"}}),t("stop",{offset:"100%",style:{"stop-color":"var(--red)","stop-opacity":"0"}})]),t("radialGradient",{id:"logo-gradient",cx:"20%",cy:"0%",r:"150%",fx:"50%",fy:"50%"},[t("stop",{offset:"0%",style:{"stop-color":"var(--lavender)","stop-opacity":"1"}}),t("stop",{offset:"100%",style:{"stop-color":"var(--mauve)","stop-opacity":"1"}})])],-1),t("g",{mask:"url(#logo-mask)"},[t("rect",{width:"100%",height:"100%",fill:"url(#logo-gradient)"}),t("path",{id:"logo-path-1",d:`M 9.7,7.7
                                               L 7.4,2 
                                               C 7.2,1.6, 6.6,1.25, 6.25,1.25 
                                               H 2.3
                                               C 2.05,1.25, 1.2,1.6, 1.2,2.5
                                               V 7.7
                                               C 1.2,8.5, 2,8.75, 2.3,8.75
                                               H 9
                                               L 10,10`,stroke:"none",fill:"none"}),t("path",{id:"logo-path-2",d:`M 9.85,7.8
                                               L 12.2,2.1
                                               L 12.2,2
                                               L 12.5,0`,stroke:"none",fill:"none"}),t("path",{id:"logo-path-3",d:`M 9.7,7.7
                                               L 9.82,8
                                               C 10,8.4, 10.5,8.75, 10.75,8.75
                                               H 17.5
                                               C 17.8,8.75, 18.5,8.4, 18.5,7.5
                                               V 2.5
                                               C 18.5,1.6, 17.8,1.25, 17.5,1.25
                                               H 8.5
                                               L 7.5,0`,stroke:"none",fill:"none"}),t("circle",{r:"1",fill:"url(#radial-gradient)"},[t("animateMotion",{id:"anim1",dur:"1s",fill:"freeze"},[t("mpath",{href:"#logo-path-1"})])]),t("circle",{r:"1",fill:"url(#radial-gradient)"},[t("animateMotion",{id:"anim2",dur:"0.25s",fill:"freeze"},[t("mpath",{href:"#logo-path-2"})])]),t("circle",{r:"1",fill:"url(#radial-gradient)"},[t("animateMotion",{id:"anim3",dur:"1s",fill:"freeze"},[t("mpath",{href:"#logo-path-3"})])]),t("circle",{r:"0.1",cx:"21",cy:"11",fill:"var(--red)"})],-1)]),544))]),_:1})}const x=d(g,[["render",h],["__scopeId","data-v-ccf2936e"]]);export{x as _};
