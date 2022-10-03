#!/usr/bin/python3

from optparse import OptionParser
import subprocess as proc
from shutil import copyfile

PROJ = "/home/rcs/opt/java/harborview2"

SRC = "%s/purescript/dist" % PROJ

TARGET = "%s/src/resources/public/js/maunaloa" % PROJ

JS_SRC = "%s/ps-charts.js" % SRC

JS_EXP = "%s/ps-charts.exp.js" % SRC

JS_MIN = "%s/ps-charts.min.js" % SRC

PS_HOME = "/home/pureuser"

PS_SRC = "%s/dist/ps-charts.exp.js"

PS_MIN = "%s/dist/ps-charts.min.js"


def minify():
    proc.run(["esbuild", PS_SRC, "--minify", "--outfile=%s" % PS_MIN])


def export():
    f = open(JS_SRC)

    lx = f.readlines()

    f.close()

    result = open(JS_EXP, "w")

    result.write("var PS =\n")

    for l in lx:
        if "main()" in l:
            result.write("  return {\n")
            result.write("           paint: paint8,\n")
            result.write("           paintEmpty: paintEmpty3,\n")
            result.write(
                "           clearLevelLines:  clearLevelLines }\n")
        else:
            result.write(l)

    result.close()


def copy():
    copyfile(JS_MIN, TARGET)


if __name__ == '__main__':
    parser = OptionParser()
    # parser.add_option("--exp", dest="export",
    #                  help="Export main etc to PS")
    parser.add_option("--exp", action="store_true", default=False,
                      help="Export main etc to PS (if --copy is not set)")
    parser.add_option("--min", action="store_true", default=False,
                      help="Minify js file (f --coyp is not set)")
    parser.add_option("--copy", action="store_true", default=False,
                      help="Copy exp.js or min.js(if --min is set) to src/public/js/maunaloa")
    parser.add_option("--all", action="store_true", default=False,
                      help="Export, minify and copy")
    (opts, args) = parser.parse_args()

    if opts.exp:
        if not opts.copy:
            print("Exporting...")
            export()

    if opts.min:
        if not opts.copy:
            print("Minifying...")
            minify()

    if opts.copy:
        TARGET_JS = "%s/ps-charts.js" % TARGET
        if opts.min:
            print("Copying %s to %s ..." % (JS_MIN, TARGET_JS))
            copyfile(JS_MIN, TARGET_JS)
        else:
            print("Copying %s to %s ..." % (JS_EXP, TARGET_JS))
            copyfile(JS_EXP, TARGET_JS)

    if opts.all:
        print("Exporting, minifying, and copy ...")
        export()
        minify()
        copy()
