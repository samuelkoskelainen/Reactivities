using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
  public class IsHostRequirement : IAuthorizationRequirement
  {
  }

  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly DataContext _context;
    public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
    {
      _context = context;
      _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
    IsHostRequirement requirement)
    {
      var httpContext = _httpContextAccessor.HttpContext;

      if (httpContext.Request.RouteValues.ContainsKey("id"))
      {
        var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x =>
          x.Type == ClaimTypes.NameIdentifier)?.Value;

        var activityId = Guid.Parse(httpContext.Request.RouteValues["id"].ToString());

        var activity = _context.Activities.FindAsync(activityId).Result;

        var host = activity?.UserActivities?.FirstOrDefault(x => x.IsHost == true);

        if (host?.AppUser?.UserName == currentUserName)
          context.Succeed(requirement);
      }
      else
      {
        context.Fail();
      }

      return Task.CompletedTask;
    }
  }
}