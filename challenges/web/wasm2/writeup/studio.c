#define WASM_EXPORT __attribute__((visibility("default")))

static char *challenge = "jwt0hw6136fit754kovx4ji2v3n7ru13fyq7";

void put_challenge(char *address) {
  for(int i = 0; i < 36; i++) {
    address[i] = challenge[i];
  }
}

int verify_answer(char *address) {
  for(int i = 0; i < 36; i++) {
    if(address[i] != challenge[35 - i]) {
      return 0;
    }
  }

  return 1;
}

WASM_EXPORT
void reverse_string(char *address) {
  for(int i = 0; i < (36 / 2); i++) {
    char tmp = address[i];
    address[i] = address[35 - i];
    address[35 - i] = tmp;
  }
}

WASM_EXPORT
int main() {
  put_challenge(1337);

  reverse_string(1337);

  return verify_answer(1337);
}
