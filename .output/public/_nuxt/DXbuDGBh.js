import{_ as l}from"./BF_UumNl.js";import{_ as m,o as i,p as d,w as f,c,a as t}from"./CaAd3Vrj.js";const h=""+new URL("QVC.CMajLVUU.svg",import.meta.url).href,p={name:"Logo",data(){return{isAnimating:!1}},methods:{shimmer(){if(this.isAnimating)return;this.isAnimating=!0,this.$refs.logoSvg.querySelectorAll("animateMotion").forEach(a=>{a.beginElement()}),setTimeout(()=>{this.isAnimating=!1},1e3)}}};function g(o,e,a,u,_,n){const r=l;return i(),d(r,{to:"/",class:"logo"},{default:f(()=>[(i(),c("svg",{ref:"logoSvg",height:"100%",width:"100%",viewBox:"0 0 20 10",onMouseover:e[0]||(e[0]=(...s)=>n.shimmer&&n.shimmer(...s))},e[1]||(e[1]=[t("defs",null,[t("mask",{id:"logo-mask",height:"100%",width:"100%"},[t("image",{href:h,height:"100%",width:"100%"})]),t("radialGradient",{id:"radial-gradient",cx:"50%",cy:"50%",r:"50%",fx:"50%",fy:"50%"},[t("stop",{offset:"0%",style:{"stop-color":"var(--red)","stop-opacity":"1"}}),t("stop",{offset:"100%",style:{"stop-color":"var(--red)","stop-opacity":"0"}})])],-1),t("g",{mask:"url(#logo-mask)"},[t("rect",{width:"100%",height:"100%",fill:"var(--lavender)"}),t("path",{id:"animated-path-1",d:`M 9.7,7.7
                                               L 7.4,2 
                                               C 7.2,1.6, 6.6,1.25, 6.25,1.25 
                                               H 2.3
                                               C 2.05,1.25, 1.2,1.6, 1.2,2.5
                                               V 7.7
                                               C 1.2,8.5, 2,8.75, 2.3,8.75
                                               H 9
                                               L 10,10`,stroke:"none",fill:"none"}),t("path",{id:"animated-path-2",d:`M 9.85,7.8
                                               L 12.2,2.1
                                               L 12.2,2
                                               L 12.5,0`,stroke:"none",fill:"none"}),t("path",{id:"animated-path-3",d:`M 9.7,7.7
                                               L 9.82,8
                                               C 10,8.4, 10.5,8.75, 10.75,8.75
                                               H 17.5
                                               C 17.8,8.75, 18.5,8.4, 18.5,7.5
                                               V 2.5
                                               C 18.5,1.6, 17.8,1.25, 17.5,1.25
                                               H 8.5
                                               L 7.5,0`,stroke:"none",fill:"none"}),t("circle",{r:"1",fill:"url(#radial-gradient)"},[t("animateMotion",{id:"anim1",dur:"1s",fill:"freeze"},[t("mpath",{href:"#animated-path-1"})])]),t("circle",{r:"1",fill:"url(#radial-gradient)"},[t("animateMotion",{id:"anim2",dur:"0.25s",fill:"freeze"},[t("mpath",{href:"#animated-path-2"})])]),t("circle",{r:"1",fill:"url(#radial-gradient)"},[t("animateMotion",{id:"anim3",dur:"1s",fill:"freeze"},[t("mpath",{href:"#animated-path-3"})])]),t("circle",{r:"0.1",cx:"21",cy:"11",fill:"var(--red)"})],-1)]),544))]),_:1})}const x=m(p,[["render",g],["__scopeId","data-v-18ca9ff3"]]);export{x as _};
