<script>
  import { onMount } from 'svelte';

  export let password;
  export let timesLeaked = 0;
  export let popularityPct = 0;
  let loaded = '';
  let popularityPctFormatted = `${popularityPct.toFixed(2)}%`;

  onMount(() => {
    loaded = 'loaded';
  });
</script>

<div class="pw-card {loaded}" style="--popularity-pct:{popularityPctFormatted}">
  <ul>
    <li>Password: {password}</li>
    <li>Times Leaked: {timesLeaked}</li>
    <li>Popularity: {popularityPctFormatted}</li>
  </ul>
</div>

<style>
  .pw-card {
    background: black;
    background: linear-gradient(to left, salmon 50%, lightblue 50%) var(--popularity-pct, 0%);
    background-size: 200%;
    transition: 1s ease-out;
    transition-delay: 1s;
    border-radius: 35px;
    padding: 0.5em 0;
  }

  .loaded {
  }
</style>
