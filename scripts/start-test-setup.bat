@echo off
cd ..
echo "%~1" | FindStr /R "*openethereum*"
IF %ERRORLEVEL% EQU 0 ( 
	SET extension=openethereum.toml
) ELSE (
	SET extension=nethermind.json
)
::FOR /L %%i IN (0,1,6) DO call :start-proces "%~1", "%%i", "%extension%"


START /B ../nethermind/bin/Nethermind.Runner.exe --config ".\config\node0.nethermind.json" > ".\data\node0\log" 2>&1
node ./scripts/getReservedPeer.js "0"
START /B ../openethereum/bin/openethereum.exe --config ".\config\node1.openethereum.toml" > ".\data\node1\log" 2>&1
node ./scripts/getReservedPeer.js "1"
START /B ../nethermind/bin/Nethermind.Runner.exe --config ".\config\node2.nethermind.json" > ".\data\node2\log" 2>&1
node ./scripts/getReservedPeer.js "2"
START /B ../openethereum/bin/openethereum.exe --config ".\config\node3.openethereum.toml" > ".\data\node3\log" 2>&1
node ./scripts/getReservedPeer.js "3"
START /B ../nethermind/bin/Nethermind.Runner.exe --config ".\config\node4.nethermind.json" > ".\data\node4\log" 2>&1
node ./scripts/getReservedPeer.js "4"
START /B ../openethereum/bin/openethereum.exe --config ".\config\node5.openethereum.toml" > ".\data\node5\log" 2>&1
node ./scripts/getReservedPeer.js "5"
START /B ../nethermind/bin/Nethermind.Runner.exe --config ".\config\node6.nethermind.json" > ".\data\node6\log" 2>&1
node ./scripts/getReservedPeer.js "6"

::call :start-proces "%~1", "0", "nethermind.json"
::call :start-proces "%~1", "1", "openethereum.toml"
::call :start-proces "%~1", "2", "nethermind.json"
::call :start-proces "%~1", "3", "openethereum.toml"
::call :start-proces "%~1", "4", "nethermind.json"
::call :start-proces "%~1", "5", "openethereum.toml"
::call :start-proces "%~1", "6", "nethermind.json"


:start-proces
IF NOT [%~2] EQU []	(	
	START /B %~1 --config ".\config\node%~2.%~3" > ".\data\node%~2\log" 2>&1
	node ./scripts/getReservedPeer.js "%~2"
)