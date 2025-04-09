const help = (params = []) => {

  const commands = [
    { command: 'HELP', description: 'List all available commands' },
    { command: 'CLS', description: 'Clears the screen' },
    { command: 'CD', description: 'Change the current directory' },
    { command: 'DIR', description: 'List the contents of the current directory' },
    { command: 'TYPE', description: 'Display the contents of a file' },
    { command: 'DATE', description: 'Display the date and time' },
    { command: 'NOTEPAD', description: 'Open the notepad' },
    { command: 'EXIT', description: 'Exit the program' }
  ];

  return (
    <div>
      {params.length === 0 ? (
      <div>
        <p>Available commands:</p>
        <table>
          <tbody>
            {commands.map((cmd, index) => (
              <tr key={index}>
                <td style={{ width: '30%' }}>{cmd.command}</td>
                <td style={{ width: '70%' }}>{cmd.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>) : (
      <div>
        {commands.some(cmd => cmd.command === params[0].toUpperCase()) ? (
          <p>{commands.find(cmd => cmd.command === params[0].toUpperCase()).description}</p>
        ) : (
          <p>This command is not supported by the help utility.</p>
        )}
      </div>
      )}
    </div>
  );
};

export default help;
