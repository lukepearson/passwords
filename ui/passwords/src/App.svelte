<script>
  import Logo from './assets/logo.png';
  import Password from './lib/Password.svelte';

  let passwordSearchTerms;
  let resultsPromise;

  const searchPasswords = async (term) => {
    const res = await fetch(`https://pwnedpular.apps.sgfault.com/api?passwords=${term}`);
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
    <img src={Logo} class="logo svelte" alt="Svelte Logo" />
  </div>

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
    {:else}
      <p>Enter a password above to find out how hard it's been pwned.</p>
      <p>You can also enter a comma-separated list of passwords to check many at once. 100x the pwnage!</p>
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
