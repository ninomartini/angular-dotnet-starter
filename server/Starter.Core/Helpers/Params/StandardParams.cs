namespace Starter.Core.Helpers.Params;

public class StandardParams : PaginationParams
{
    public string SortKey { get; set; } = "rowVersion";
    public bool SortDesc { get; set; } = false;
    public string Filter { get; set; }
}  