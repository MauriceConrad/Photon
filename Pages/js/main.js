window.addEventListener("load", function() {
  const markdownTargets = document.querySelectorAll("[data-markdown]");

  const domParser = new DOMParser();

  for (let target of markdownTargets) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", target.dataset.markdown);
    xhr.addEventListener("load", function() {
      var markdown = this.response;
      const startPos = markdown.search(target.dataset["markdown-start"] || 0);
      markdown = markdown.substring(startPos);
      const html = marked(markdown);
      target.innerHTML = html;

      for (let pre of target.getElementsByTagName("pre")) {
        pre.classList.add("hljs-highligted");
        let code = pre.getElementsByTagName("code")[0];
        //code.classList.add(code.dataset.language || "bash");
        hljs.highlightBlock(code);
      }

    });
    xhr.send();
  }
});
