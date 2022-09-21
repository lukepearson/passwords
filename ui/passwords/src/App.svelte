<script>
  import svelteLogo from './assets/svelte.svg';
  import Password from './lib/Password.svelte';

  let passwordSearchTerms;
  let resultsPromise;

  const searchPasswords = async (term) => {
    const res = await fetch(`https://pwnedpular.apps.sgfault.com?passwords=${term}`);
    const results = await res.json();
    console.log(results)
    return results;
  }

  const handleSearchPasswordsBtnClicked = () => {
    console.log(passwordSearchTerms);
    resultsPromise = searchPasswords(passwordSearchTerms);
    //const { term, count, hash, percent, search_time } = resBody[0];

  }
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank"> 
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank"> 
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>pwnedpopular</h1>

  <div class="card">
    <input bind:value={passwordSearchTerms}>
    <button on:click={handleSearchPasswordsBtnClicked}>
      Search
    </button>
  </div>

  {#if resultsPromise}
  <div class="card">
    {#await resultsPromise}
        <p>Searching...</p>
    {:then results}
      {#each results as { term: password, count: timesLeaked, percent: popularityPct }}
        <Password {password} {timesLeaked} {popularityPct} />
      {/each}
    {:catch error}
        <p>{error.message}</p>
    {/await}
  </div>
  {/if}

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
