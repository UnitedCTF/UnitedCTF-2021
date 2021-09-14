jmp _system_section_end

halt:
  cli
  hlt
  jmp halt

_system_section_end: