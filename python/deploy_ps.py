PROJ = "/home/rcs/opt/java/harborview2"

SRC = "%s/purescript/dist/ps-charts.js" % PROJ

TARGET = "%s/src/resources/public/js/maunaloa/ps-charts.js" % PROJ

f = open(SRC)

lx = f.readlines()

f.close()

result = open(TARGET, "w")

result.write("var PS =\n")

for l in lx:
    if "main()" in l:
        result.write("  return {\n")
        result.write("           paint: paint8,\n")
        result.write("           paintEmpty: paintEmpty3,\n")
        result.write("           clearLevelLines:  clearLevelLines }\n")
    else:
        result.write(l)

result.close()
