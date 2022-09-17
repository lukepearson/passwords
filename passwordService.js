module.exports = (http) => {
  return {
    search: async (passwords) => {
      const res = await http(`https://pwnedpular.apps.sgfault.com/?passwords=${passwords.join(',')}`);
      return res.data;
    },
  };
}
