# Rust Circle Counter

This crate is the current multi-surface Rust `Wasm_v1` Circle example.

Prepared by Denis CMIX for the Octra network.

Use, modify, adapt, and redistribute this example as you see fit. No additional
restrictions are imposed by the example author.

Exports:

* `octra_manifest`
* `octra_query`
* `octra_update`
* `octra_alloc`

Logical methods:

* `get_counter`
* `inc`
* `caller_echo`
* `state_path_key_of`
* `runtime_guard`
* `state_class_of`
* `state_delivery_key_of`
* `balance_commitment_of`
* `balance_workflow_status_of`
* `object_status_of`
* `object_last_transition_of`
* `object_member_status_of`
* `object_quorum_of`
* `binding_version_of`
* `register_proof_kind_of`
* `register_binding_version_of`
* `register_workflow_status_of`
* `fhe_commit_loaded_pk_of`
* `fhe_encrypt_of`
* `fhe_encrypt_zero_of`
* `fhe_decrypt_of`
* `fhe_add_of`
* `fhe_sub_of`
* `fhe_scale_of`
* `fhe_add_const_of`
* `fhe_sub_const_of`
* `fhe_pedersen_of`
* `fhe_commit_of`
* `fhe_bound_commitment_of`
* `fhe_verify_zero_of`
* `fhe_verify_range_of`
* `fhe_verify_bound_of`
* `prepare_room`
* `prepare_register_lane`
* `promote_room`
* `kernel_probe`

Build:

```bash
cargo build --target wasm32-unknown-unknown --release
```

Local Circle deploy flow:

```bash
/Users/lambda0xe/Desktop/octra_next/_build/default/bin/circle_deploy.exe build \
  /Users/lambda0xe/Desktop/octra_next/contracts/examples/rust_circle_counter

/Users/lambda0xe/Desktop/octra_next/_build/default/bin/circle_deploy.exe deploy \
  /Users/lambda0xe/Desktop/octra_next/contracts/examples/rust_circle_counter

/Users/lambda0xe/Desktop/octra_next/_build/default/bin/circle_deploy.exe info \
  /Users/lambda0xe/Desktop/octra_next/contracts/examples/rust_circle_counter

/Users/lambda0xe/Desktop/octra_next/_build/default/bin/circle_deploy.exe view \
  /Users/lambda0xe/Desktop/octra_next/contracts/examples/rust_circle_counter \
  get_counter

/Users/lambda0xe/Desktop/octra_next/_build/default/bin/circle_deploy.exe call \
  /Users/lambda0xe/Desktop/octra_next/contracts/examples/rust_circle_counter \
  inc
```

`circle_deploy deploy` writes local state to:

```text
.circle-dev/last_deploy.json
```

That means `info`, `view`, and `call` can be run from the app directory without
repeating `--circle-id` after the first deploy.

For a deliberate deny-case:

```bash
/Users/lambda0xe/Desktop/octra_next/_build/default/bin/circle_deploy.exe call \
  /Users/lambda0xe/Desktop/octra_next/contracts/examples/rust_circle_counter \
  kernel_probe
```

That command prints structured rejected-tx JSON and exits with code `2`.

Serious local Rust app flow already works:

* `prepare_room`
* `prepare_register_lane`
* `promote_room`

Those methods exercise typed private state, balance/register cells, workflows,
object policy, and multi-object transitions from a real `wasm_v1` Rust guest.

Security expectations:

* `inc` is a normal state mutation path
* `fhe_*` views exercise the policy-gated HFHE membrane from a real Rust guest
* `fhe_commit_loaded_pk_of` proves `fhe_load_pk` is usable inside the guest without trying to echo a large serialized public key through the normal Circle response ceiling
* `fhe_encrypt_of`, `fhe_encrypt_zero_of`, and `fhe_decrypt_of` prove the runtime-key-scoped encrypt / decrypt membrane works without exposing ambient secret access to the guest
* `prepare_room` exercises typed state, private cell, binding, workflow, and object-policy verbs through the high-level Rust SDK helpers
* `prepare_register_lane` exercises register-cell and register-workflow verbs through the high-level Rust SDK helpers
* `promote_room` exercises object-transition application and multi-member composition as a first-class app operation from Rust
* `kernel_probe` intentionally attempts a reserved kernel write
* the Circle runtime may execute the guest update, but commit must reject the reserved write
