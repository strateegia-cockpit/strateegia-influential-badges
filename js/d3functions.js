export function tabulate(data, columns) {
  let table = d3.select('#table-body');
  //add class to table
  table.attr('class', 'table table-striped table-bordered table-hover w-75 mx-auto');
  let thead = table.select('thead')
  let tbody = table.select('tbody');
  
  tbody.selectAll('tr').remove();
  thead.selectAll('th').remove();
  
  columns.forEach(column => {
    thead.append('th').text(column);
  });

  data.forEach(function (row) {
    let tr = tbody.append('tr');
    columns.forEach(function (column) {
      tr.append('td').text(row[column]);
    });
  });

  // thead = thead.selectAll('th')
  //   .data(columns);

  // thead.join(
  //   function (enter) {
  //     return enter.append('th')
  //       .text(d => d.replace(/_/g, ' '));
  //   },
  //   function (update) {
  //     return update.style('opacity', 1);
  //   },
  //   function (exit) {
  //     return exit.remove();
  //   }
  // );

  // // create a row for each object in the data
  // let rows = tbody.selectAll('tr')
  //   .data(data, d => d.id);
  //   let _rows = rows.enter()
  //   .append('tr');
  //   rows.append('tr');
  //   rows.exit().remove();

  // // create a cell in each row for each column
  // let cells = _rows.selectAll('td')
  //   .data(function (row) {
  //     return columns.map(function (column) {
  //       return { column: column, value: row[column] };
  //     });
  //   });
  // cells.enter()
  //   .append('td')
  //   .text(function (d) { return d.value; });
  // cells
  //   .append('td')
  //   .text(function (d) { return d.value; });
  // cells.exit().remove();

  // tbody.selectAll('tr')
  //     .sort((a,b) => d3.descending(a.score, b.score));
  //     // .order();

  return table;
}

export function updateOptionsList(htmlElement, inputData){
  let options = d3.select(htmlElement);
  options.selectAll('option').remove();
  inputData.forEach(function (row) { 
    options.append('option').attr('value', row.id).text(row.title);
  });
  options.on("change", () => {});
}