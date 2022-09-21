<script>
    export let password;
    export let timesLeaked = 0;
    export let popularityPct = 0;
</script>

<ul>
    <li>Password: {password}</li>
    <li>Times Leaked: {timesLeaked}</li>
    <li>Popularity: {Number.parseInt(popularityPct).toFixed(4)}%</li>
</ul>
