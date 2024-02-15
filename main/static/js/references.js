// (() => {
//   // the references need to be in the format <sup><a href="#quelle-bla"></a></sup>
//   let references = $("sup>a[href*='#quelle-']");
//   let sources = $("div.quellen li");
//   let find_source = function(ref){
//     let id = ref.href.split("#")[1];
//     for (let source of sources){
//       if (source.id==id){return source}
//     }
//   }
//   for (ref of references){
//     let source = find_source(ref);
//     ref.textContent = sources.index(source)+1;
//   }
// })();

(() => {
  let highlighter = () => {
    let references = $("a[href*='#quelle-']");
    for (ref of references) {
      if (ref.getAttribute("href") == location.hash) {
        ref.classList.add("highlight");
      } else {
        ref.classList.remove("highlight");
      }
    }
  }
  window.addEventListener("hashchange", highlighter);
  highlighter();
})();