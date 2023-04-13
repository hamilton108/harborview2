#!/usr/bin/python3

from cmath import exp
from optparse import OptionParser
from os.path import (isfile, getmtime)
import subprocess as proc
from shutil import copyfile

PROJ = "/home/rcs/opt/java/harborview2"

SRC = "%s/purescript/dist" % PROJ

TARGET = "%s/src/resources/public/js/maunaloa" % PROJ

JS_SRC = "%s/ps-charts.js" % SRC

JS_EXP = "%s/ps-charts.exp.js" % SRC

JS_MIN = "%s/ps-charts.min.js" % SRC

PS_HOME = "/home/pureuser"

PS_SRC = "%s/dist/ps-charts.js" % PS_HOME

PS_EXP = "%s/dist/ps-charts.exp.js" % PS_HOME

PS_MIN = "%s/dist/ps-charts.min.js" % PS_HOME


def build():
    proc.run(["spago", "bundle-app", "--main", "Main", "--to", PS_SRC])


def minify():
    proc.run(["esbuild", PS_EXP, "--minify", "--outfile=%s" % PS_MIN])


def export():
    f = open(JS_SRC)

    lx = f.readlines()

    f.close()

    result = open(JS_EXP, "w")

    result.write("var PS =\n")

    for l in lx:
        if "main()" in l:
            result.write("  return {\n")
            result.write("           paint: paint7,\n")
            result.write("           paintEmpty: paintEmpty3,\n")
            result.write("           resetCharts: resetCharts2,\n")
            result.write(
                "           clearLevelLines:  clearLevelLines }\n")
        else:
            result.write(l)

    result.close()


def copy():
    copyfile(JS_MIN, TARGET)


def get_fexist():
    result = 0
    if isfile(JS_SRC) == True:
        result += 1
    if isfile(JS_EXP) == True:
        result += 2
    if isfile(JS_MIN) == True:
        result += 4
    return result


def get_fstats():
    fex = get_fexist()
    if fex == 0:
        return [0, 0, 0, 0]
    elif fex == 1:
        return [1, 0, 0, 0]
    elif fex == 2:
        return [0, 0, 0, 0]
    elif fex == 3:
        return [3, getmtime(JS_SRC), getmtime(JS_EXP), 0]
    elif fex == 4:
        return [0, 0, 0, 0]
    elif fex == 5:
        return [5, getmtime(JS_SRC), 0, getmtime(JS_MIN)]
    elif fex == 6:
        return [0, 0, 0, 0]
    elif fex == 7:
        return [7, getmtime(JS_SRC), getmtime(JS_EXP), getmtime(JS_MIN)]


def preprocess():
    [fex, t1, t2, t3] = get_fstats()
    print("Preprocessing [%d,%.2f,%.2f,%.2f]" % (fex, t1, t2, t3))
    if fex in [0, 2, 4, 6]:
        build()
        export()
    elif fex == 1:
        export()
    elif fex == 3:
        if t2 > t1:
            print("Building...")
            build()
        export()
    elif fex == 7:
        if t2 > t1:
            print("Building...")
            build()
        export()
    else:
        print("No action for [%d,%.2f,%.2f,%.2f]" % (fex, t1, t2, t3))


MODULES = {
    "1": "ps-charts",
    "2": "ps-optionpurchase",
}

if __name__ == '__main__':
    parser = OptionParser()
    # parser.add_option("--exp", dest="export",
    #                  help="Export main etc to PS")
    parser.add_option("--module", dest="module",
                      help="Module: 1 -> Charts, 2 -> Option purchases. Default: 1")
    parser.add_option("--build", action="store_true", default=False,
                      help="Build module")
    parser.add_option("--exp", action="store_true", default=False,
                      help="Export main etc to PS (if --copy is not set)")
    parser.add_option("--min", action="store_true", default=False,
                      help="Minify js file (if --copy is not set)")
    parser.add_option("--copy", action="store_true", default=False,
                      help="Copy exp.js or min.js to src/public/js/maunaloa")
    parser.add_option("--all", action="store_true", default=False,
                      help="Export, minify and copy")
    parser.add_option("--bec", action="store_true", default=False,
                      help="Build, export, and copy")
    (opts, args) = parser.parse_args()

    if not opts.module:
        MODULE = "ps-charts"
    else:
        MODULE = MODULES[opts.module]

    if opts.build:
        build()

    if opts.exp:
        print("Exporting...")
        export()

    if opts.min:
        print("Minifying...")
        minify()

    TARGET_JS = "%s/ps-charts.js" % TARGET

    if opts.copy:
        # preprocess()
        if opts.min:
            print("Copying %s to %s ..." % (JS_MIN, TARGET_JS))
            copyfile(JS_MIN, TARGET_JS)
        else:
            print("Copying %s to %s ..." % (JS_EXP, TARGET_JS))
            copyfile(JS_EXP, TARGET_JS)

    if opts.bec:
        print("Build, exporting, and copy...")
        build()
        export()
        copyfile(JS_EXP, TARGET_JS)

    if opts.all:
        print("Building, exporting, minifying, and copy ...")
        build()
        export()
        minify()
        copy()
