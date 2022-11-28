<template>
  <router-view />
</template>

<script>
export default {
  components: {

  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        // Sets the page title based on the  meta attribute 'title' inside the router.
        document.title = to.meta.title || 'DEFAUlT';
      }
    },
  },
  beforeMount() {

  }
};
</script>

<!-- eslint-disable vue-scoped-css/enforce-style-type -->
<style>

/* Define global css variables */
:root {
  --transition-quick: 0.1s;
  --transition-slow: 0.3s;
  --scale-hover-small: 1.1;
  --scale-hover-big: 1.2;
  --scale-shrink: 0.92;
}

html, body, #app {
  margin: 0;
  height: 100%;
  width: 100%;
}

/*
    FONTS
 */


@font-face {
  font-family: "Tommy";
  src: local("Tommy"), url(assets/fonts/Tommy.otf) format("opentype");
}


* {
  font-family: "Tommy", sans-serif;
  color: var(--text);
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4, h5, h6, tspan {

}

em, strong {
  color: var(--text-contrast1);
}

/*
  COLOR THEMES
*/
body {
  --accent1: #ffb700;
  --accent1-contrast: #e1a300;
  --accent2: #e1f300;
  --accent2-contrast: #b8c900;
}

body {
  --bg: #fefcfa;
  --bg-translucid: rgba(254, 252, 250, 0.5);
  --bg-translucid2: rgba(255, 238, 215, 0.5);
  --bg-contrast: #ffeed7;
  --bg-contrast1: #ffeed7;
  --bg-contrast2: #ffeed7;
  --bg-contrast3: #64C8FF;

  --text: #e3bc43;
  --text-contrast: #b08c1d;
  --text-contrast1: #987814;
  --text-contrast2: #70580f;

  --accent1: #5674C4;
  --accent1-contrast: #385fc5;
  --accent2: #E3BECC;
  --accent2-contrast: #dc97b1;
}

</style>
<!--eslint-enable-->