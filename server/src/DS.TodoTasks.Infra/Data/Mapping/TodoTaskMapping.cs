using DS.TodoTasks.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DS.TodoTasks.Infra.Data.Mapping
{
    public class TodoTaskMapping : IEntityTypeConfiguration<TodoTask>
    {
        public void Configure(EntityTypeBuilder<TodoTask> builder)
        {
            builder.HasKey(t => t.Id)
                .HasName("PKtbtodotask");

            builder.Property(t => t.Id)
                .HasColumnName("id")
                .HasColumnType("int")
                .ValueGeneratedOnAdd()
                .IsRequired(true);

            builder.Property(t => t.Title)
                .HasColumnName("title")
                .HasColumnType("varchar(100)")
                .HasMaxLength(100)
                .IsRequired(true);

            builder.Property(t => t.Description)
                .HasColumnName("description")
                .HasColumnType("varchar(500)")
                .HasMaxLength(500)
                .IsRequired(false);

            builder.Property(t => t.Status)
                .HasColumnName("status")
                .HasColumnType("int")
                .HasConversion<int>()
                .IsRequired(true);

            builder.Property(t => t.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime2")
                .IsRequired(true);

            builder.Property(t => t.CompletedAt)
                .HasColumnName("completed_at")
                .HasColumnType("datetime2")
                .IsRequired(false);

            builder.ToTable("tb_todo_task", "todo");
        }
    }
}
