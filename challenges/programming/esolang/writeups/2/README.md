# Writeup

The challenge is pretty long and can be very overwhelming at first. You may notice what looks like blocks, this was made intentionally to give a more "modular" design. You'll want to tackle the challenge block-by-block to solve fully.

## Header Module

The first block is both an `@` generator and `TF` valdiator. The `@` are fed into the following blocks, and the output is fed back up to the validator. If you get a `F` output, you'll see that the `T` is removed from the drop in the validator.

## Validator Modules

All subsequent blocks are small challenges. They take one `@` and pass it through the validating body. You can simplify the task by taking out the block and debugging the specific block. Some blocks trick you by using data from elsewhere. There is no special trick, keep track of the stacks and check the outputs.
