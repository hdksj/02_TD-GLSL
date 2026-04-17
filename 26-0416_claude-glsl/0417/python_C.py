import random
import string

PHRASES = [
    "EVERYTHING IS\nDATA\nDATA IS\nEVERYTHING\nWE ARE\nTHE SIGNAL",
    "SILENCE BEFORE\nTHE WAVE\nTHE WAVE\nBEFORE THE SOUND\nTHE SOUND\nIS LIGHT",
    "ORDER EMERGES\nFROM NOISE\nNOISE RETURNS\nTO ORDER\nTHIS IS\nTHE LOOP",
    "WHAT YOU SEE\nIS DELAY\nWHAT YOU HEAR\nIS MEMORY\nWHAT REMAINS\nIS FORM",
    "THE PATTERN\nHAS NO CENTER\nTHE CENTER\nIS THE PATTERN\nBEGIN\nAGAIN NOW"
]

FIX_DURATION  = 20   # フィックスしておくフレーム数
FIX_SCRAMBLE  = 0.02 # フィックス中にランダムに動く文字の割合

def scramble(text, ratio):
    result = []
    for c in text:
        if c == '\n':
            result.append(c)
        elif random.random() < ratio:
            result.append(random.choice(string.ascii_uppercase))
        else:
            result.append(c)
    return ''.join(result)

def onStart():
    me.store('prev_count', -1)
    me.store('fix_timer', 0)
    return

def onExit():
    return

def onFrameStart(frame):
    prev_count = me.fetch('prev_count', -1)
    fix_timer  = me.fetch('fix_timer', 0)

    count  = int(op('count1')[0])
    target = PHRASES[count % len(PHRASES)]

    if count != prev_count:
        prev_count = count
        fix_timer  = FIX_DURATION

    if fix_timer > 0:
        fix_timer -= 1
        # フィックス中も一部の文字だけ動かす
        op('text1').par.text = scramble(target, FIX_SCRAMBLE)
    else:
        # 通常スクランブル
        op('text1').par.text = scramble(target, 0.5)

    me.store('prev_count', prev_count)
    me.store('fix_timer', fix_timer)

def onFrameEnd(frame):
    return