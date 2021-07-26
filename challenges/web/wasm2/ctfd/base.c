#define WASM_EXPORT __attribute__((visibility("default")))

extern void put_challenge(char *address);
extern void verify_answer(char *address);

WASM_EXPORT
int main() {
  // PUT C HERE

  return 0;
}
