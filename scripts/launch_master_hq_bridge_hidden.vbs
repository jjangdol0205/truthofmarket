Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
scriptsDir = fso.GetParentFolderName(WScript.ScriptFullName)
div1Dir = fso.GetParentFolderName(scriptsDir)
hqDir = fso.GetParentFolderName(div1Dir)
hubDir = fso.BuildPath(hqDir, "telegram_5bot_hub")
batFile = fso.BuildPath(hubDir, "run_5bot_hub_forever.bat")
If fso.FileExists(batFile) Then
    sh.CurrentDirectory = hubDir
    sh.Run "cmd.exe /c """ & batFile & """", 0, False
End If
