using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValuesController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly DataContext _context;

        public ValuesController(ILogger<WeatherForecastController> logger,DataContext context)
        {
            _logger = logger;
            _context=context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Value>>> GetAsync()
        {
            var values = await _context.Values.ToListAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Value>>> GetAsync(int id)
        {
            var value = await _context.Values.FindAsync(id);
            return Ok(value);
        }

/*
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
*/        
    }
}
