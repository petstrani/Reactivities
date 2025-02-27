using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    //  tu bomo določili query in handler na ta query
    public class List
    {
        public class Query:IRequest<List<Activity>> {}

        // zadolžen za http requests in http responses
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context ;

            public Handler(DataContext context)
            {
                _context = context;
            }

            
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities.ToListAsync();
                return activities;

            }
        }

    }
}
