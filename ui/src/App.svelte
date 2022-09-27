<script>
  import Logo from './assets/logo.png';
  import Password from './lib/Password.svelte';

  let passwordSearchTerms;
  let resultsPromise;

  const searchPasswords = async (term) => {
    const res = await fetch(`https://pwnedpular.apps.sgfault.com/api?passwords=${term}`);
    return res.json();
  };

  const handleSearchPasswordsBtnClicked = () => {
    resultsPromise = searchPasswords(passwordSearchTerms);
  };

  const handleSearchKeyPress = (e) => {
    const EnterKeyCode = 13;
    if (e.keyCode === EnterKeyCode) {
      handleSearchPasswordsBtnClicked();
      e.stopPropagation();
    }
  };
</script>

<main>
  <div>
    <img src={Logo} class="logo svelte" alt="pwned logo" />
  </div>

  <div class="card">
    <input type="search" size="40" bind:value={passwordSearchTerms} on:keydown={handleSearchKeyPress} class="input-field">
  </div>
  <button on:click={handleSearchPasswordsBtnClicked} class="search-btn">
    Search
  </button>

  {#if resultsPromise}
    <div class="card">
      {#await resultsPromise}
        <p>Searching...</p>
        {:then results}
        {#each results.sort((a, b) => b.popularityPct - a.popularityPct) as { term: password, count: timesLeaked, percent: popularityPct }}
          <div class="result">
            <Password {password} {timesLeaked} {popularityPct} />
          </div>
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
  .result {
    margin-bottom: 1em;
  }
  .input-field {
    padding: 1em;
    font-size: 1.1rem;
    margin-right: 1.0rem;
    border: 2px solid yellow;
  }
  .search-btn {
    padding: 1em 3em;
    border: 1px solid white;
  }
  .search-btn:hover {
    background: rgba(255,255,255,0.2);
  }
</style>
