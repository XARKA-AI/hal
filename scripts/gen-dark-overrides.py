opacities = ['', '/0', '/5', '/8', '/10', '/15', '/20', '/25', '/30', '/35', '/40',
             '/45', '/48', '/50', '/55', '/60', '/62', '/65', '/68', '/70', '/75',
             '/78', '/80', '/85', '/88', '/90', '/92', '/94', '/95',
             '/[0.04]', '/[0.07]', '/[0.08]']


def alpha_str(suf: str) -> str:
    if suf == '':
        return '1'
    if suf.startswith('/['):
        return suf[2:-1]
    pct = int(suf[1:])
    return f'{pct/100:.2f}'


def esc(opacity: str) -> str:
    out = '\\[\\#001F3F\\]'
    if opacity == '':
        return out
    if opacity.startswith('/['):
        n = opacity[2:-1].replace('.', '\\.')
        return out + '\\/\\[' + n + '\\]'
    return out + '\\/' + opacity[1:]


lines = []
lines.append('/*')
lines.append(' * --- L&T DARK MODE (pure-black brand override) ---')
lines.append(' * Auto-generated: navy surfaces -> BLACK, navy text -> YELLOW, navy borders')
lines.append(' * -> subtle white. Covers every [#001F3F] opacity variant used.')
lines.append(' */')

lines.append('\n/* Solid backgrounds */')
for op in opacities:
    a = alpha_str(op)
    lines.append(f'.dark .bg-{esc(op)} {{ background-color: rgb(0 0 0 / {a}); }}')

lines.append('\n/* Text -> L&T yellow accent */')
for op in opacities:
    a = alpha_str(op)
    lines.append(f'.dark .text-{esc(op)} {{ color: rgb(255 202 35 / {a}); }}')

lines.append('\n/* Borders -> subtle white */')
for op in opacities:
    a = alpha_str(op)
    try:
        af = float(a)
    except ValueError:
        af = 1.0
    af = min(af, 0.35)
    lines.append(f'.dark .border-{esc(op)} {{ border-color: rgb(255 255 255 / {af:.3f}); }}')

lines.append('\n/* Gradient color stops */')
for op in opacities:
    a = alpha_str(op)
    lines.append(f'.dark .from-{esc(op)} {{ --tw-gradient-from: rgb(0 0 0 / {a}) var(--tw-gradient-from-position); --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }}')
    lines.append(f'.dark .to-{esc(op)} {{ --tw-gradient-to: rgb(0 0 0 / {a}) var(--tw-gradient-to-position); }}')
    lines.append(f'.dark .via-{esc(op)} {{ --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / {a}) var(--tw-gradient-via-position), var(--tw-gradient-to); }}')

lines.append('\n/* Shadows */')
for op in opacities:
    a = alpha_str(op)
    lines.append(f'.dark .shadow-{esc(op)} {{ --tw-shadow-color: rgb(0 0 0 / {a}); --tw-shadow: var(--tw-shadow-colored); }}')

lines.append('\n/* Rings -> L&T yellow */')
for op in opacities:
    a = alpha_str(op)
    lines.append(f'.dark .ring-{esc(op)} {{ --tw-ring-color: rgb(255 202 35 / {a}); }}')

lines.append('\n/* Hover & focus variants */')
for prefix in ['hover', 'focus-visible']:
    sel_prefix = prefix.replace(':', '\\:') + '\\:'
    pseudo = f':{prefix}'
    for op in opacities:
        a = alpha_str(op)
        try:
            af = float(a)
        except ValueError:
            af = 1.0
        af = min(af, 0.35)
        esc_bg = '.' + sel_prefix + 'bg-' + esc(op)
        esc_text = '.' + sel_prefix + 'text-' + esc(op)
        esc_border = '.' + sel_prefix + 'border-' + esc(op)
        esc_ring = '.' + sel_prefix + 'ring-' + esc(op)
        lines.append(f'.dark {esc_bg}{pseudo} {{ background-color: rgb(0 0 0 / {a}); }}')
        lines.append(f'.dark {esc_text}{pseudo} {{ color: rgb(255 202 35 / {a}); }}')
        lines.append(f'.dark {esc_border}{pseudo} {{ border-color: rgb(255 255 255 / {af:.3f}); }}')
        lines.append(f'.dark {esc_ring}{pseudo} {{ --tw-ring-color: rgb(255 202 35 / {a}); }}')

lines.append('\n/* group-hover variants */')
for op in opacities:
    a = alpha_str(op)
    e = esc(op)
    lines.append(f'.dark .group:hover .group-hover\\:bg-{e} {{ background-color: rgb(0 0 0 / {a}); }}')
    lines.append(f'.dark .group:hover .group-hover\\:text-{e} {{ color: rgb(255 202 35 / {a}); }}')
    lines.append(f'.dark .group:hover .group-hover\\:border-{e} {{ border-color: rgb(255 255 255 / 0.20); }}')

lines.append('\n/* L&T navy dark (hover/active variant #000F25) */')
lines.append('.dark .bg-\\[\\#000F25\\] { background-color: #0a0a0a; }')
lines.append('.dark .hover\\:bg-\\[\\#000F25\\]:hover { background-color: #161616; }')
lines.append('.dark .text-\\[\\#000F25\\] { color: #FFCA23; }')
lines.append('.dark .border-\\[\\#000F25\\] { border-color: rgb(255 255 255 / 0.18); }')

lines.append('\n/* L&T navy lighter variant #0A2F57 */')
lines.append('.dark .bg-\\[\\#0A2F57\\] { background-color: #0d0d0d; }')
lines.append('.dark .text-\\[\\#0A2F57\\] { color: #FFCA23; }')
lines.append('.dark .border-\\[\\#0A2F57\\] { border-color: rgb(255 255 255 / 0.18); }')

lines.append('\n/* Deep navy #051020 / #071428 -> pure black */')
lines.append('.dark .bg-\\[\\#051020\\] { background-color: #000000; }')
lines.append('.dark .bg-\\[\\#071428\\] { background-color: #000000; }')
lines.append('.dark .from-\\[\\#051020\\]\\/92 { --tw-gradient-from: rgb(0 0 0 / 0.92) var(--tw-gradient-from-position); --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }')
lines.append('.dark .to-\\[\\#051020\\]\\/88 { --tw-gradient-to: rgb(0 0 0 / 0.88) var(--tw-gradient-to-position); }')
lines.append('.dark .to-\\[\\#051020\\]\\/95 { --tw-gradient-to: rgb(0 0 0 / 0.95) var(--tw-gradient-to-position); }')
lines.append('.dark .via-\\[\\#051020\\]\\/95 { --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.95) var(--tw-gradient-via-position), var(--tw-gradient-to); }')
lines.append('.dark .from-\\[\\#071428\\]\\/55 { --tw-gradient-from: rgb(0 0 0 / 0.55) var(--tw-gradient-from-position); --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }')

print('\n'.join(lines))
