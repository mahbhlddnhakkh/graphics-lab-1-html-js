import os

linkerStrings = {
  "compileOrder": [r"./js/util.js", r"./js/history.js", r"./js/filters-base.js", r"./js/filters.js", r"./js/index.js"],
  "replaceWithEmpty": ["export "],
  "ignoreLineThatStartsWith": ["import "],
  "onTopFormat": 
"""

// --------------------------------------------------------------------------------------------------------------------------------
// Compiled $filename$
// --------------------------------------------------------------------------------------------------------------------------------

""",
  "compiledPath": r"./compiled.js",
  "backupCompiledPath": r"./compiled-backup.js",
  "errorJSScript": 
  """
message = "linker-js.py error: $linker_error_msg$";
let e = document.getElementById("error-message");
const out = '[' + new Date().toLocaleString().replace(", ", "/") + '] ' + message;
console.error(out);
e.textContent = out;
e.style.display = "block";
  """,
  "defaultJSSript":
  """
message = "JS is not compiled yet! Run linker-js.py.";
let e = document.getElementById("error-message");
const out = '[' + new Date().toLocaleString().replace(", ", "/") + '] ' + message;
console.error(out);
e.textContent = out;
e.style.display = "block";
  """,
}

linkerOptions = {
  "doBackup": False, # Warning: backups are not tested.
  "advancedReplace": True,
  "writeLineCount": True,
}

def DoMagic():
  LogInfo("Starting linker...")
  """
  if (linkerOptions["doBackup"]):
    # Not tested
    # TODO: test pls
    LogInfo("Creating backup...")
    backup_success = True
    if (os.path.isfile(linkerStrings["backupCompiledPath"])):
      LogInfo("Removing old backup file...")
      try:
        os.remove(linkerStrings["backupCompiledPath"])
      except:
        LogError("Error removing old backup.")
      else:
        LogInfo("Removing old backup file... Success.")
    if (os.path.isfile(linkerStrings["compiledPath"])):
      LogInfo("Renaming old compiled JS file...")
      try:
        os.rename(linkerStrings["compiledPath"], linkerStrings["backupCompiledPath"])
      except:
        LogError("Error renaming old compiled JS file.")
        backup_success = False
      else:
        LogInfo("Renaming old compiled JS file... Success.")
    else:
      LogWarning("Old compiled JS not found, can't create backup.")
      backup_success = False
    if (backup_success):
      LogInfo("Creating backup... Success.")
  """
  LogInfo("Validating JS files...")
  compileOrderSize = len(linkerStrings["compileOrder"])
  for i in range(compileOrderSize):
    if (os.path.isfile(linkerStrings["compileOrder"][i])):
      LogInfo(linkerStrings["compileOrder"][i] + " exists.")
    else:
      LogError(linkerStrings["compileOrder"][i] + " doesn't exist! Shutting down...")
      return
  
  LogInfo("Compiling...")
  replaceWithEmptySize = len(linkerStrings["replaceWithEmpty"])
  ignoreLineThatStartsWithSize = len(linkerStrings["ignoreLineThatStartsWith"])
  try:
    LogInfo("Creating " + linkerStrings["compiledPath"])
    with open(linkerStrings["compiledPath"], "w") as comp:
      for i in range(compileOrderSize):
        LogInfo("Opening " + linkerStrings["compileOrder"][i])
        with open(linkerStrings["compileOrder"][i], "r") as f:
          comp.write(linkerStrings["onTopFormat"].replace("$filename$", linkerStrings["compileOrder"][i].split("/")[-1]))
          lineIndex = 1
          for line in f:
            ignoreThisLine = False
            if (linkerOptions["writeLineCount"]):
              comp.write('/*'+str(lineIndex)+'*/ ')
            lineIndex += 1
            for j in range(ignoreLineThatStartsWithSize):
              if (line.startswith(linkerStrings["ignoreLineThatStartsWith"][j])):
                ignoreThisLine = True
                break
            if (ignoreThisLine):
              comp.write('\n')
              continue
            for j in range(replaceWithEmptySize):
              if (linkerOptions["advancedReplace"]):
                line = AdvancedReplace(line, linkerStrings["replaceWithEmpty"][j], "")
              else:
                line = line.replace(linkerStrings["replaceWithEmpty"][j], "")
            comp.write(line)
          LogInfo("Successfully copied " + linkerStrings["compileOrder"][i])
  except:
    LogError("Error opening files.")
  else:
    LogInfo("Compiling... Success.\nUse " + linkerStrings["compiledPath"])


def AdvancedReplace(line, replace_from, replace_to):
  """
  Advanced Replace ignores replace_from if it's inside a string.
  E.g.: AdvancedReplace("aaa eee 'aaa eee'", "aaa ", "") -> "eee 'aaa eee'"
  """
  strType = None # ` ; ' ; "
  strTypePossible = ["`", "'", '"']
  ind_found = 0
  ind_found_prev = 0
  while True:
    ind_found = line.find(replace_from, ind_found)
    if (ind_found == -1):
      return line
    for i in range(ind_found_prev, ind_found+1):
      if (line[i] == strType):
        strType = None
      if (line[i] in strTypePossible and strType == None):
        strType = line[i]
    if (strType == None):
      # https://stackoverflow.com/a/41097792
      line = line[0:ind_found] + str(line[ind_found:]).replace(replace_from, replace_to, 1)
    ind_found_prev = ind_found
    ind_found += 1


def LogError(msg):
  DoLog("ERRO", msg)

def LogInfo(msg):
  DoLog("INFO", msg)

def LogWarning(msg):
  DoLog("WARN", msg)

def DoLog(type, msg):
  print("[" + type + "] " + msg)

if (__name__ == "__main__"):
  DoMagic()
