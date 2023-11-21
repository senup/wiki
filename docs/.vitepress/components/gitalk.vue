<template>
    <div class="gitalk-container">
      <div id="gitalk-container"></div>
    </div>
</template>
<script>
import md5 from "md5"
import Gitalk from "gitalk"
import "gitalk/dist/gitalk.css"
export default {
  name: "gitalk",
  data() {
    return {}
  },
  mounted() {
    const commentConfig = {
      clientID: "882a0d4881afe483768e",
      clientSecret: "29d755e1e13bcdf3e62f3c39a23b4812d1e106f3",
      repo: "wiki",
      owner: "senup",
      admin: ["senup"],
      id: md5(location.pathname),
      distractionFreeMode: false,
    }
    const gitalk = new Gitalk(commentConfig)
    gitalk.render("gitalk-container")
  },
}
</script>
<style>
.gt-container .gt-header-textarea {
  color: #000;
}
</style> 