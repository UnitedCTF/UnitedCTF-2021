import fetch from "node-fetch";

const benchmark_encrypt = async (
  payload_length: number,
  iterations: number
) => {
  const params = new URLSearchParams();
  params.set("plaintext", "0".repeat(payload_length));
  const sparams = params.toString();

  let sum = 0;
  for (let i = 0; i < iterations; ++i) {
    const start = Date.now();
    await fetch("http://localhost:5000/encrypt?" + sparams);
    sum += Date.now() - start;
  }
  console.log("encrypt", sum / iterations + "ms");
};

const benchmark_decrypt = async (
  payload_length: number,
  iterations: number
) => {
  const params = new URLSearchParams();
  params.set("plaintext", "0".repeat(payload_length));
  params.set(
    "ciphertext",
    await fetch("http://localhost:5000/encrypt?" + params.toString()).then(
      (r) => r.text()
    )
  );

  params.delete("plaintext");
  const sparams = params.toString();

  let sum = 0;
  for (let i = 0; i < iterations; ++i) {
    const start = Date.now();
    await fetch("http://localhost:5000/decrypt?" + sparams);
    sum += Date.now() - start;
  }
  console.log("decrypt", sum / iterations + "ms");
};

const benchmark_bad_decrypt = async (
  payload_length: number,
  iterations: number
) => {
  const params = new URLSearchParams();
  params.set("plaintext", "0".repeat(payload_length));
  const ciphertext = await fetch(
    "http://localhost:5000/encrypt?" + params.toString()
  )
    .then((r) => r.text())
    .then((t) => Buffer.from(t, "hex"));
  params.delete("plaintext");

  for (let j = 0; j < 256; ++j) {
    ciphertext[ciphertext.length - 17] = ciphertext[ciphertext.length - 17] + 1;
    params.set("ciphertext", ciphertext.toString("hex"));

    const sparams = params.toString();
    const hex = ciphertext[ciphertext.length - 17].toString(16);

    console.time(hex);
    let sum = 0;
    for (let i = 0; i < iterations; ++i) {
      const start = Date.now();
      await fetch("http://localhost:5000/decrypt?" + sparams);
      sum += Date.now() - start;
    }
    console.timeEnd(hex);
    console.log("bad_decrypt", hex, sum / iterations + "ms");
  }
  return 0;
};

(async () => {
  const payload_length = 16,
    iterations = 1000;
  await benchmark_encrypt(payload_length, iterations);
  await benchmark_decrypt(payload_length, iterations);
  await benchmark_bad_decrypt(payload_length, iterations);
})();
