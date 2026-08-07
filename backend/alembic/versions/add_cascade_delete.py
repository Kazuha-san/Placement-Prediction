"""add_cascade_delete

Revision ID: add_cascade_delete
Revises: add_user_profile_fields
Create Date: 2026-08-07 17:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_cascade_delete'
down_revision = 'add_user_profile_fields'
branch_labels = None
depends_on = None

def upgrade():
    # Drop existing foreign key constraints
    op.drop_constraint('profiles_user_id_fkey', 'profiles', type_='foreignkey')
    op.drop_constraint('predictions_user_id_fkey', 'predictions', type_='foreignkey')
    
    # Recreate with ON DELETE CASCADE
    op.create_foreign_key('profiles_user_id_fkey', 'profiles', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('predictions_user_id_fkey', 'predictions', 'users', ['user_id'], ['id'], ondelete='CASCADE')

def downgrade():
    # Drop cascade constraints
    op.drop_constraint('profiles_user_id_fkey', 'profiles', type_='foreignkey')
    op.drop_constraint('predictions_user_id_fkey', 'predictions', type_='foreignkey')
    
    # Recreate without cascade
    op.create_foreign_key('profiles_user_id_fkey', 'profiles', 'users', ['user_id'], ['id'])
    op.create_foreign_key('predictions_user_id_fkey', 'predictions', 'users', ['user_id'], ['id'])
