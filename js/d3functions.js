export function tabulate(data, columns) {
  let table = d3.select('#table-body');
  //add class to table
  table.attr('class', 'table table-striped table-bordered table-hover')
  let thead = table.select('thead')
  let tbody = table.select('tbody');

  thead = thead.selectAll('th')
    .data(columns);

  thead.join(
    function (enter) {
      return enter.append('th')
        .text(d => d.replace(/_/g, ' '));
    },
    function (update) {
      return update.style('opacity', 1);
    },
    function (exit) {
      return exit.remove();
    }
  );

  // create a row for each object in the data
  let rows = tbody.selectAll('tr')
    .data(data, d => d.id);
  let _rows = rows;
  rows = rows.enter()
    .append('tr');
  _rows.append('tr');
  _rows.exit().remove();

  // create a cell in each row for each column
  let cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return { column: column, value: row[column] };
      });
    });
    cells.enter()
    .append('td')
    .text(function (d) { return d.value; });
    cells
    .append('td')
    .text(function (d) { return d.value; });
    cells.exit().remove();

  return table;
}