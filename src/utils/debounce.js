export default function (func, delay = 1000) {
  let timer;
  return function (...args) {
    return new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const result = await func.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
