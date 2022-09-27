<script>
  import { onMount } from 'svelte';

  export let password;
  export let timesLeaked = 0;
  export let popularityPct = 0;
  let loaded = '';
  let popularityPctFormatted = `${100.0 - popularityPct.toFixed(2)}%`;
  let timesLeakedFormatted = new Intl.NumberFormat('en-GB').format(timesLeaked);

  onMount(() => {
    loaded = 'loaded';
  });
</script>

<div class="password-card {loaded}" style="--popularity-pct:{popularityPctFormatted}">
    <span class="password-term">{password}</span>
    <span class="password-subtitle">Found in {timesLeakedFormatted} leaks</span>
</div>

<style>
  .password-card {
    background: black;
    background: linear-gradient(to right, salmon 50%, rgba(0,0,0,1.0) 50%) var(--popularity-pct, 0%);
    color: white;
    background-size: 200%;
    transition: 1s ease-out;
    border-radius: 35px;
    padding: 1em 1.5em;
  }

  .password-term {
    display: block;
    text-align: left;
    unicode-bidi: embed;
    font-family: monospace;
    font-size: 1.5em;
    white-space: pre;
    font-weight: 700;
  }

  .password-subtitle {
    display: block;
    text-align: right;
    font-size: 0.85rem;
  }
</style>
