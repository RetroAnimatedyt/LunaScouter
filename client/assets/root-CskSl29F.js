import{w as r,a,M as l,L as d,S as c,b as p,O as f,i as u}from"./chunk-NL6KNZEE-BxV1z1Wy.js";import{j as e}from"./welcome-D_zvdyIk.js";const m=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function j({children:n}){return e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(l,{}),e.jsx(d,{})]}),e.jsxs("body",{children:[n,e.jsx(c,{}),e.jsx(p,{})]}),e.jsx("div",{id:"offline-indicator",style:{position:"fixed",right:"1rem",bottom:"1rem",zIndex:1e3,background:"#f87171",color:"white",borderRadius:"50%",width:"48px",height:"48px",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",display:"none"},title:"You are offline",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"8",y1:"15",x2:"16",y2:"15"})]})}),e.jsx("script",{dangerouslySetInnerHTML:{__html:`
        function updateOfflineIndicator() {
          var el = document.getElementById('offline-indicator');
          if (!navigator.onLine) {
            el.style.display = 'flex';
          } else {
            el.style.display = 'none';
          }
        }
        window.addEventListener('online', updateOfflineIndicator);
        window.addEventListener('offline', updateOfflineIndicator);
        updateOfflineIndicator();
      `}})]})}const y=r(function(){return e.jsx(f,{})}),g=a(function({error:t}){let o="Oops!",s="An unexpected error occurred.",i;return u(t)&&(o=t.status===404?"404":"Error",s=t.status===404?"The requested page could not be found.":t.statusText||s),e.jsxs("main",{className:"pt-16 p-4 container mx-auto",children:[e.jsx("h1",{children:o}),e.jsx("p",{children:s}),i]})});export{g as ErrorBoundary,j as Layout,y as default,m as links};
