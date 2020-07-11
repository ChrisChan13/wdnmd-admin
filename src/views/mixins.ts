export default {
  filters: {
    toLocaleDate(date: string | number) {
      return new Date(date).toLocaleString();
    },
    toDigitMoney(money: number | string) {
      return (+money).toFixed(2);
    },
  },
};
