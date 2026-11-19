Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
scriptsDir = fso.GetParentFolderName(WScript.ScriptFullName)
div1Dir = fso.GetParentFolderName(scriptsDir)
batFile = fso.BuildPath(scriptsDir, "run_daily_market_close_sync.bat")
If fso.FileExists(batFile) Then
    sh.CurrentDirectory = div1Dir
    sh.Run "cmd.exe /c """ & batFile & """", 0, False
End If
